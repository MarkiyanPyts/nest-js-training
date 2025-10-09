import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { TaskStatus } from '../src/tasks/tasks.model';

describe('Authentication and Authorization (e2e)', () => {
  let testSetup: TestSetup;
  let authToken: string;
  let taskId: string;

  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
  };

  beforeEach(async () => {
    testSetup = await TestSetup.create(AppModule);

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    const responseBody = loginResponse.body as { accessToken: string };

    authToken = responseBody.accessToken;

    const createTaskResponse = await request(testSetup.app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        labels: [{ name: 'test' }],
      });

    const createTaskResponseBody = createTaskResponse.body as {
      id: string;
    };

    taskId = createTaskResponseBody.id;
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });

  it('should not allow access to other users tasks', async () => {
    const otherUsers = {
      ...testUser,
      email: 'other@example.com',
    };

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUsers);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: otherUsers.email,
        password: otherUsers.password,
      });

    const loginResponseBody = loginResponse.body as { accessToken: string };

    const otherToken = loginResponseBody.accessToken;
    console.log(taskId);
    await request(testSetup.app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });
});
