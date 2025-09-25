import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface AppConfig {
  messagePrefix: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    messagePrefix: process.env.MESSAGE_PREFIX || 'Hello ',
  }),
);

export const appConfigSchema = Joi.object({
  MESSAGE_PREFIX: Joi.string().default('Hello '),
  NEW_ENV: Joi.string(),
});
