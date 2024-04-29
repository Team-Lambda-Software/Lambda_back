import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestController } from './test/infraestructure/controller/test.controller'

@Module({
  imports: [
    ConfigModule.forRoot()
  ],
  controllers: [TestController],
  providers: [],
})
export class AppModule {}
