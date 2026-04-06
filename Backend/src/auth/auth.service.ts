import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { UserDocument } from '../users/entities/user.schema';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  private readonly revokedTokens = new Set<string>();
  private googleClientId = '';
  private googleClient = new OAuth2Client();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID', '');
    this.googleClient = new OAuth2Client(this.googleClientId);
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
}
