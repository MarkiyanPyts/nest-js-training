import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from './app.config';
import { AuthConfig } from './auth.config';

export interface ConfigType {
  app: AppConfig;
  database: TypeOrmModuleOptions;
  auth: AuthConfig;
}
