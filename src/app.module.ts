import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { odmDataBaseProviders, ormDatabaseProvider } from './common/Infraestructure/providers/db-providers/db-provider'
import { UserController } from './user/infraestructure/controller/user.controller'
import { AuthController } from './auth/infraestructure/controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { CourseController } from './course/infraestructure/controller/courses.controller'
import { BlogController } from './blog/infraestructure/controller/blog.controller'
import { TrainerController } from './trainer/infraestructure/controller/trainer.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { NotificationController } from './notification/infraestructure/controller/notification.controller'
import { CategoryController } from './categories/infraesctructure/controller/category.controller'
import { SearchController } from './search/infraestructure/controller/search.controller'
import { ProgressController } from './progress/infraestructure/controller/progress.controller'
import { CommentController } from './comment/infraestructure/controller/comment.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { OdmUserEntity, UserSchema } from './user/infraestructure/entities/odm-entities/odm-user.entity'
import { TrainerSchema } from './trainer/infraestructure/entities/odm-entities/odm-trainer.entity'
import { CategorySchema } from './categories/infraesctructure/entities/odm-entities/odm-category.entity'

@Module( {
  imports: [

    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB,
      {
        dbName: 'lambdaMongoDb',
      }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '48h'
      }
    }),
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      }
    ]),
    MongooseModule.forFeature([
      {
        name: 'Trainer',
        schema: TrainerSchema,
      }
    ]),
    MongooseModule.forFeature([
      {
        name: 'Category',
        schema: CategorySchema,
      }
    ])

  ],
  controllers: [
    UserController,
    AuthController,
    CourseController, 
    BlogController,
    NotificationController,
    CategoryController,
    SearchController,
    TrainerController,
    ProgressController,
    CommentController
  ],
  providers: [     
    ormDatabaseProvider,
    odmDataBaseProviders
  ],
})

export class AppModule {}
