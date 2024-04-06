import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if ( !process.env.PORT ) {
    console.log(' > .env not found it')
  } else {
    console.log(' > .env found it')
  }
  await app.listen(process.env.PORT || 7001);
}
bootstrap();
