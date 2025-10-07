import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({//mock the bcrypt function, it will not be called
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should hash password', async () => {
    const mockHash = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash); // we mock function to return this response without being called
    const password = 'password123';
    const result = await service.hash(password);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10); //Spy if our function is passing expected params to third party libs
    expect(result).toBe(mockHash);
  });

  it('should correctly verify password', async () => {
    const password = 'password123';
    const mockHash = 'hashed_password';
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const result = await service.verify(password, mockHash);

    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockHash);
    expect(result).toBe(await bcrypt.compare(password, mockHash));
    expect(result).toBe(true);
  });

  it('should fail on incorrect password', async () => {
    const wrongPass = 'wrong';
    const mockHash = 'hashed_password';
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const result = await service.verify(wrongPass, mockHash);

    expect(bcrypt.compare).toHaveBeenCalledWith(wrongPass, mockHash);
    expect(result).toBe(await bcrypt.compare(wrongPass, mockHash));
    expect(result).toBe(false);
  });
});
