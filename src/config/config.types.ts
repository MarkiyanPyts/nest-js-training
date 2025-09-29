import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from './app.config';

export interface ConfigType {
  app: AppConfig;
  database: TypeOrmModuleOptions;
}
