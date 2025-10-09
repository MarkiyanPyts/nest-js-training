import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../create-user.dto';
import { User } from '../user.entiry';
import { AuthService } from './auth.service';
import { LoginDto } from '../login.tdo';
import { LoginResponse } from '../login.response';
import type { AuthRequest } from '../auth.request';
import { UserService } from '../user/user.service';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../role.enum';
import { AdminResponse } from '../admin.response';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Public()
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return new LoginResponse({ accessToken });
  }

  @Get('/profile')
  async profile(@Request() request: AuthRequest): Promise<User> {
    const user = await this.userService.findOne(request.user.sub);

    if (user) {
      return user;
    }

    throw new NotFoundException();
  }

  @Get('/admin')
  @Roles(Role.ADMIN)
  adminsOnly(): AdminResponse {
    return new AdminResponse({ message: 'This is for admins only' });
  }
}
