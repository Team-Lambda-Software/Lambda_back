import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json } from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  if ( !process.env.PORT ) {
    // console.log(' > .env not found it')
  } else {
    // console.log(' > .env found it')
  }
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, transformOptions: { enableImplicitConversion: true } }),
  );
  app.use(json({ limit: '50mb' }));
  const config = new DocumentBuilder()
    
    .setTitle('Lambda Gymnastic API')
    .setDescription('Gymnastic endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.PORT || 3000);
  // console.log(`Application is running on: ${await app.getUrl()}`);

}
bootstrap();
