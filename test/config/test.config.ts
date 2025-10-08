export const testConfig = {
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'nestcource',
    password: 'postgres',
    database: 'tasks_e2e',
    synchronize: true, // newer have it set to true in production
  },
  app: {
    messagePrefix: '',
  },
  auth: {
    jwt: {
      secret: 'secret-123',
      expiresIn: '1m',
    },
  },
};
