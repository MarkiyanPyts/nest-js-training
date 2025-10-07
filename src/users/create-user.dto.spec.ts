import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.email = 'test@test.com';
    dto.password = 'strongPassword123#';
    dto.name = 'Test User';
  });

  const testPassword = async (password: string, message: string) => {
    dto.password = password;
    const errors = await validate(dto);

    const passwordError = errors.find((err) => err.property === 'password');
    expect(passwordError).not.toBeUndefined();
    // expect(passwordError?.constraints).toHaveProperty('minLength');

    const messages = Object.values(passwordError?.constraints ?? []);

    expect(messages).toContain(message);
  };

  it('should validate complete valid data', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if email is missing', async () => {
    dto.email = 'testtest.com';
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should fail without 1 upper case letter', async () => {
    await testPassword('short', 'must contain at least 1 uppercase letter');
  });

  it('should contain at least 1 number', async () => {
    await testPassword('shortA', 'must contain at least 1 number');
  });

  it('should contain at least 1 special character', async () => {
    await testPassword(
      'abcdefaA1',
      'must contain at least 1 special character',
    );
  });
});
