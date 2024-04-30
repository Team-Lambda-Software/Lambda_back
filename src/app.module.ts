import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TestController } from './test/infraestructure/controller/test.controller'
import { ormDatabaseProvider } from './common/Infraestructure/providers/db-providers/db-provider'
import { UserController } from './user/infraestructure/controller/user.controller'
import { AuthController } from './auth/infraestructure/controller/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [
    TestController, 
    UserController,
    AuthController
  ],
  providers: [ ormDatabaseProvider],
})
export class AppModule {}
