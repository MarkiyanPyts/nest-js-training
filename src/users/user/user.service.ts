import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entiry';
import { PasswordService } from '../password/password.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  public async createUser(CreateUserDto: CreateUserDto) {
    const hashedPassword = await this.passwordService.hash(
      CreateUserDto.password,
    );

    const user = this.userRepository.create({
      ...CreateUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  public async findOne(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
}
