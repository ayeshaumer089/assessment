type Env = Record<string, string | undefined>;

export function validateEnv(config: Env) {
  const requiredKeys = ['MONGODB_URI', 'JWT_SECRET'];

  for (const key of requiredKeys) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return {
    PORT: config.PORT ?? '5000',
    NODE_ENV: config.NODE_ENV ?? 'development',
    MONGODB_URI: config.MONGODB_URI,
    JWT_SECRET: config.JWT_SECRET,
    JWT_EXPIRES_IN: config.JWT_EXPIRES_IN ?? '1d',
    GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID ?? '',
    GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET ?? '',
    FRONTEND_BASE_URL: config.FRONTEND_BASE_URL ?? 'http://localhost:5173',
    PASSWORD_RESET_TOKEN_SECRET: config.PASSWORD_RESET_TOKEN_SECRET ?? '',
    PASSWORD_RESET_TOKEN_EXPIRES_IN: config.PASSWORD_RESET_TOKEN_EXPIRES_IN ?? '15m',
    SMTP_HOST: config.SMTP_HOST ?? '',
    SMTP_PORT: config.SMTP_PORT ?? '587',
    SMTP_SECURE: config.SMTP_SECURE ?? 'false',
    SMTP_USER: config.SMTP_USER ?? '',
    SMTP_PASS: config.SMTP_PASS ?? '',
    SMTP_FROM: config.SMTP_FROM ?? '',
  };
}
