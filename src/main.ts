import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  // Create a new Nest application
  const app = await NestFactory.create(AppModule);

  // Enable the use of pipes in the application
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  // Set the application to listen on port 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${port}`);
}
bootstrap();
