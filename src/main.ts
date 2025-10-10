import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
      whitelist: true, // Strip properties that do not have any decorators
      // forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      // disableErrorMessages: false, // Enable detailed error messages (set to true in production for security)
    }),
  );
  const port = process.env.PORT ?? 3000;
  await app.listen(port).then(() => {
    console.log(`App Started On Port ${port}`);
  });
}
bootstrap();
