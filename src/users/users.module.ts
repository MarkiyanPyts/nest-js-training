import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entiry';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypedConfigService } from 'src/config/typed-config.service';
import { AuthConfig } from 'src/config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: TypedConfigService) => {
        const authConfig = config.get('auth') as AuthConfig;
        return {
          secret: authConfig?.jwt.secret,
          expiresIn: authConfig?.jwt.expiresIn,
        };
      },
    }),
  ],
})
export class UsersModule {}
