import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entiry';
import { Role } from '../src/users/role.enum';
import { Repository } from 'typeorm';
import { PasswordService } from '../src/users/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from '../src/users/login.response';

describe('AppController (e2e)', () => {
  let testSetup: TestSetup;

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
  };

  it('/auth/register (POST)', () => {
    return request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect((res) => {
        const responseBody = res.body as { email: string; name: string };
        expect(responseBody.email).toBe(testUser.email);
        expect(responseBody.name).toBe(testUser.name);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/register (POST) - duplicate email', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(409);
  });

  it('should require auth', () => {
    return request(testSetup.app.getHttpServer()).get('/tasks').expect(401);
  });

  it('should allow public route access', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(201);
  });

  it('should include roles in JWT token', async () => {
    const userRepo = testSetup.app.get<Repository<User>>(
      getRepositoryToken(User),
    );
    await userRepo.save({
      ...testUser,
      roles: [Role.ADMIN],
      password: await testSetup.app
        .get(PasswordService)
        .hash(testUser.password),
    });

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const responseBody = response.body as LoginResponse;
    const decoded = testSetup.app
      .get(JwtService)
      .verify<User>(responseBody.accessToken);
    expect(decoded.roles).toBeDefined();
    expect(decoded.roles).toContain(Role.ADMIN);
  });

  it('/auth/login (POST) - login', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    // Type assertion to avoid unsafe member access
    const responseBody = response.body as { accessToken: string };

    expect(response.status).toBe(201);
    expect(responseBody.accessToken).toBeDefined();
  });

  it('/auth/profile (GET) - get user profile', async () => {
    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    // Type assertion to avoid unsafe member access
    const responseBody = response.body as { accessToken: string };
    const token = responseBody.accessToken;

    return await request(testSetup.app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        const responseBody = res.body as { email: string; name: string };
        expect(responseBody.email).toBe(testUser.email);
        expect(res.body).not.toHaveProperty('password');
      });
  });

  it('/auth/profile (GET) - make sure endpoint is protected', async () => {
    return await request(testSetup.app.getHttpServer())
      .get('/auth/profile')
      .expect(401);
  });
});
