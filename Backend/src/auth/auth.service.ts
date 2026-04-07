import { BadRequestException, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { UserDocument } from '../users/entities/user.schema';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly revokedTokens = new Set<string>();
  private googleClientId = '';
  private googleClient = new OAuth2Client();
  private mailTransporter: Transporter | null = null;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID', '');
    this.googleClient = new OAuth2Client(this.googleClientId);
    this.initializeMailTransporter();
  }

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const password = await bcrypt.hash(dto.password, 12);
    const user = await this.usersService.createUser({
      name: dto.name,
      email: dto.email,
      password,
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email, true);
    if (!user?.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }

  async googleAuth(credential: string) {
    if (!this.googleClientId) {
      throw new UnauthorizedException('Google auth is not configured');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience: this.googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      throw new UnauthorizedException('Google account email is not verified');
    }

    const email = payload.email.toLowerCase();
    const displayName = payload.name?.trim() || email.split('@')[0];
    let user = await this.usersService.findByEmail(email, true);

    if (!user) {
      const generatedPassword = await bcrypt.hash(`google:${payload.sub}:${Date.now()}`, 12);
      user = await this.usersService.createUser({
        name: displayName,
        email,
        password: generatedPassword,
      });
    }

    return this.buildAuthResponse(user);
  }

  async googleAuthCode(code: string) {
    if (!this.googleClientId) {
      throw new UnauthorizedException('Google auth is not configured');
    }

    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET', '');
    if (!clientSecret) {
      throw new UnauthorizedException('Google client secret is not configured');
    }

    const redirectUri = this.configService.get<string>('GOOGLE_REDIRECT_URI', 'postmessage');
    const oauthClient = new OAuth2Client(this.googleClientId, clientSecret, redirectUri);

    const tokenResponse = await oauthClient.getToken({
      code,
      redirect_uri: redirectUri,
    });

    const idToken = tokenResponse.tokens.id_token;
    if (!idToken) {
      throw new UnauthorizedException('Google did not return ID token');
    }

    return this.googleAuth(idToken);
  }

  getGoogleConfig() {
    return {
      clientId: this.googleClientId || null,
      enabled: Boolean(this.googleClientId),
    };
  }

  async logout(token: string) {
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    this.revokedTokens.add(token);
    return { message: 'Logged out successfully' };
  }

  isTokenRevoked(token: string) {
    return this.revokedTokens.has(token);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email, true);
    if (!user) {
      return { message: 'If this email is registered, a password reset link has been sent.' };
    }

    const resetToken = await this.jwtService.signAsync(
      { sub: user.id, type: 'password-reset' },
      {
        secret: this.getPasswordResetSecret(),
        expiresIn: this.configService.get<string>('PASSWORD_RESET_TOKEN_EXPIRES_IN', '15m'),
      },
    );

    const frontendBaseUrl = this.configService.get<string>('FRONTEND_BASE_URL', 'http://localhost:5173');
    const resetUrl = `${frontendBaseUrl.replace(/\/+$/, '')}/?page=reset-password&token=${encodeURIComponent(resetToken)}`;
    await this.sendPasswordResetEmail(user.email, resetUrl);

    return { message: 'If this email is registered, a password reset link has been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    let payload: { sub: string; type?: string };
    try {
      payload = await this.jwtService.verifyAsync(dto.token, {
        secret: this.getPasswordResetSecret(),
      });
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (payload.type !== 'password-reset' || !payload.sub) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.usersService.findById(payload.sub, true);
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: 'Password updated successfully' };
  }

  private async buildAuthResponse(user: UserDocument) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: this.mapUser(user),
    };
  }

  private mapUser(user: UserDocument) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private getPasswordResetSecret() {
    return this.configService.get<string>('PASSWORD_RESET_TOKEN_SECRET') || this.configService.getOrThrow<string>('JWT_SECRET');
  }

  private initializeMailTransporter() {
    const host = this.configService.get<string>('SMTP_HOST', '');
    const port = Number(this.configService.get<string>('SMTP_PORT', '587'));
    const user = this.configService.get<string>('SMTP_USER', '');
    const pass = this.configService.get<string>('SMTP_PASS', '');
    const secure = this.configService.get<string>('SMTP_SECURE', 'false') === 'true';

    if (!host || !port || !user || !pass) {
      this.mailTransporter = null;
      return;
    }

    this.mailTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  private async sendPasswordResetEmail(email: string, resetUrl: string) {
    if (!this.mailTransporter) {
      // Keeps forgot-password endpoint functional in local setups without SMTP.
      console.warn(`SMTP is not configured. Password reset link for ${email}: ${resetUrl}`);
      return;
    }

    const fromEmail = this.configService.get<string>('SMTP_FROM') || this.configService.get<string>('SMTP_USER', '');
    await this.mailTransporter.sendMail({
      from: fromEmail,
      to: email,
      subject: 'Reset your NexusAI password',
      text: `Use this link to reset your password: ${resetUrl}. This link will expire soon.`,
      html: `<p>Use the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link will expire soon.</p>`,
    });
  }
}
