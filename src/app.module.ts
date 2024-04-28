import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestController } from './test/infraestructure/controller/test.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ormConfig } from 'db-connection-configurations/orm-config/orm-config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormConfig)
  ],
  controllers: [TestController],
  providers: [],
})
export class AppModule {}
