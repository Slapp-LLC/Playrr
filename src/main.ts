import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Playrr API')
    .setDescription(
      'This repository contains the API code for a sports app that enables users to create, search and sign up for events. Core features include login/signup, event management, chat, event creation, and sign up.',
    )
    .setVersion('1.0')
    .addTag('Playrr')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
