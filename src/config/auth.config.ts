import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  secret: string;
  expiresIn: string;
}

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '60m',
  }),
);
