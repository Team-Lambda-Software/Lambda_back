import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TestController } from './test/infraestructure/controller/test.controller'
import { ormDatabaseProvider } from './common/Infraestructure/providers/db-providers/db-provider'
import { UserController } from './user/infraestructure/controller/user.controller'
import { AuthController } from './auth/infraestructure/controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/infraestructure/jwt/strategy/jwt.strategy';
import { CourseController } from './course/infraestructure/controller/courses.controller'
import { BlogController } from './blog/infraestructure/controller/blog.controller'
import { ScheduleModule } from '@nestjs/schedule'

@Module( {
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' }
    }),
  ],
  controllers: [
    TestController, 
    UserController,
    AuthController,
    CourseController, 
    BlogController
  ],
  providers: [     
    ormDatabaseProvider,
    JwtStrategy
  ],
})
export class AppModule {}
