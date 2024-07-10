import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json } from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true, transformOptions: { enableImplicitConversion: true } }),
  );
  app.use(json({ limit: '200mb' }));
  const config = new DocumentBuilder()
    .setTitle('Lambda Gymnastic API')
    .setDescription('Gymnastic endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  await app.listen(process.env.PORT || 3000);

}
bootstrap();
