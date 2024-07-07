import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json } from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  /*app.enableCors({
    origin: true,
    methods: ["GET","HEAD","PUT","PATCH","POST","DELETE","OPTIONS"],
    credentials: true,
  });*/
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true, transformOptions: { enableImplicitConversion: true } }),
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

}
bootstrap();
