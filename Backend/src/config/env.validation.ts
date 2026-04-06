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
  };
}
