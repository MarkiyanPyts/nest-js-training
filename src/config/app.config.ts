import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  messagePrefix: process.env.MESSAGE_PREFIX || 'Hello ',
}));
