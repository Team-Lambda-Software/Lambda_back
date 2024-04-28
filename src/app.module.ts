import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestController } from './test/infraestructure/controller/test.controller'
import { ormDatabaseProvider } from './common/Infraestructure/providers/db-providers/db-provider'
import { UserController } from './user/infraestructure/controller/user.controller'

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [TestController, UserController],
  providers: [ ormDatabaseProvider],
})
export class AppModule {}
