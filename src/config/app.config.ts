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
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNC: Joi.number().valid(0, 1).required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});
