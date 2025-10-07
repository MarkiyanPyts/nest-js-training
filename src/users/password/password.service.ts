import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly SALT_RONDS = 10;

  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_RONDS);
  }

  public async verify(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
