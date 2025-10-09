import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { TaskStatus } from '../src/tasks/tasks.model';
import { PaginationResponse } from 'src/common/pagination.response';
import { Task } from 'src/tasks/task.entiry';

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
    const otherUser = {
      ...testUser,
      email: 'other@example.com',
    };

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUser);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: otherUser.email,
        password: otherUser.password,
      });

    const loginResponseBody = loginResponse.body as { accessToken: string };

    const otherToken = loginResponseBody.accessToken;

    await request(testSetup.app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);
  });

  it('should list users tasks only', async () => {
    await request(testSetup.app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        const resBody = res.body as PaginationResponse<Task>;
        console.log(resBody);
        expect(resBody.meta.total).toBe(1);
      });

    const otherUser = {
      ...testUser,
      email: 'other@example.com',
    };

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUser);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({
        email: otherUser.email,
        password: otherUser.password,
      });

    const loginResponseBody = loginResponse.body as { accessToken: string };

    const otherToken = loginResponseBody.accessToken;
    await request(testSetup.app.getHttpServer())
      .get(`/tasks`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200)
      .expect((res) => {
        const resBody = res.body as PaginationResponse<Task>;

        expect(resBody.meta.total).toBe(0);
      });
  });
});
