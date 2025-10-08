import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entiry';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypedConfigService } from 'src/config/typed-config.service';
import { AuthConfig } from 'src/config/auth.config';
import { PasswordService } from './password/password.service';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
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
  providers: [PasswordService, UserService, AuthService, AuthGuard],
  controllers: [AuthController],
})
export class UsersModule {}
