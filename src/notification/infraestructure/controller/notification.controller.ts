import { Body, Controller, Inject, Logger, UseGuards } from "@nestjs/common";
import { Get, Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { SaveTokenDto } from "../dto/entry/save-token.infraestructure.dto";
import * as admin from 'firebase-admin';
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { OrmNotificationAddressRepository } from "../repositories/orm-notification-repository";
import { DataSource } from "typeorm";
import { INotificationAddressRepository } from "src/notification/domain/repositories/notification-address-repository.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository";
import { OrmUserMapper } from "src/user/infraestructure/mappers/orm-mapper/orm-user-mapper";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository";
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper";
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper";
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper";
import { GetNotificationsUserDto } from "../dto/entry/get-notifications-user.infraestructure.dto";
import { INotificationAlertRepository } from "src/notification/domain/repositories/notification-alert-repository.interface";
import { OrmNotificationAlertRepository } from "../repositories/orm-notification-alert-repository";
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { GetNotificationsUserByEmailApplicationService } from "src/notification/domain/service/get-notifications-user-by-email.service";
import { SaveTokenAddressApplicationService } from "src/notification/domain/service/save-token-address-services.service";
import { NotifyGoodDayApplicationService } from "src/notification/domain/service/notify-good-day-services.service";
import { NotifyRecommendCourseApplicationService } from "src/notification/domain/service/notify-recommend-course-services.service";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { SaveTokenSwaggerResponseDto } from "../dto/response/save-token-address-swagger-response.dto";
import { GetNotificationsUserSwaggerResponseDto } from "../dto/response/get-notifications-user-swagger-response.dto";
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/Infraestructure/logger/logger";

const credentials:object = {
    type: "service_account",
    project_id: "myawe-91958",
    private_key_id: "cdd2a0da10bd579f3b4052cbad71ca0140d91d7d",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCSs35f3hHNKTb4\nNZO6lOfMrH864dAgRF54TD/QkxnUMde+u2sJbhypD29oa3nUngeMF5zsnkHFNrBs\n/DSLsAlHl1C4gJArbvvADeopWSBylhhZHsot995V0UyFgpDfjL8fSt08So0aGPD2\nOtGZKZlEDBby4TCTWMPgsI78NaQUP2YY2dbmIkQRlfXKfMoEVJX+Pj6OysGDL1TY\nnwItMX9cDDCAU2acNlabOKNtrSvssISr4FF+qxec7WX/I/1PcNrHsWbrUzDfZUqo\n5Ndmr97EY8QF4OoREa87HcLd23hZ33Y56tsoqZgMBxI+pXQzgcAh25PZxRj/gMcn\ndrkYhS3BAgMBAAECggEABGdWAygjGRlIR6xRzNZdxJEOZQrQktnjizVYfm0Of8Yu\n4IhPJ9Rn4McsXi5I/Qnw/n6KVtffr/0er9hUplduiWEmZqHxFfUwAl92jqcAymDF\nHoZ+HaHy0RkaNLknCrdemLiYTlgrbvfGArGwf1JKYgqR/Sinauplj5z0L1fnvuXu\nSLvgSfTeEzOP9seYtYFbE0ERyB/2uAyQw4eYKAvgkeuyNkeh0nxV76tpReHfB55L\nlMn9BFY0/RCpjzrkzPsR9VeggBJngqQsiZ4IGC3+n2DaK5pG48VqwA93awaO/KM7\nwDe7skpOqAnbmFVtKq8aGxJ0+R65NnnfxGaNAmAKoQKBgQDJVIeKNNPXeiYzOwNt\nwG+kEDJiUDPG0fEZAltF/xANNsuwHmHSYgV5WeELrBGlCGGHFXt34hmT28/+XXoW\nYlOJtOvo2ON9zKe+/YMgGh+anJrUJtYNp5jEiPpTihD/Tkwj8Q3Dlk6+oyDePW4S\nVmvXnAeIeZ8b3oclSH5uMePXoQKBgQC6iWzrj56FwzP15oru74SGfoTwxoazcfWc\nDxWTfQ2wEHhMG0FUpOA/V929GxCFJg31Bky8hJ2sApUitbKJDPCPb8+DNevJdzdv\nzvJY05bNbvbvbghLxpOBSEEl0E2G9rv9LsM/jxGSxiFwaZfXGGbMa7aKO6iEfmZ/\nhqTsnKMiIQKBgQDC+i8NpN2oJ67JHJTUfHJiNCFnXv7VxMo2izaz0jHMak3XMYVR\nBwcAIBA3ipvH9RbmiOJ7Fqforw9+6y5qcS0wBtwVM78VPNcTu1Z7B3Gl/ZZgcYAJ\n1062v2WW8/ZEGqLYiAHpci6upzMUp+9qqPFl7MDK5eY2Sksdy1hOBdj/IQKBgQCn\n16nK1yKDJ15knzlZvuiW/9Zss6VWZ27hKe13FSmwx1EG4etJ10TzmgMp+eVGeTRL\nyYxYgFdDA9vfLHBlwt/doHSukmEDmSKnlyUW6eQiGvtT+sS6MgZdaH8+IAzyKKaE\nLISAdyIP1/kUpd57KzisLStFfGKoPPfLPYK+aD6dIQKBgQC5ZLAitAMsUhgiWqZQ\nJDsAcwlM8zZ5JbQluC8yNo6PEu6o1JKlu47nrNMNUNFE9vER6vVIcW87rHc6KQZ9\n9wSqak8Qwnl22H1yXMUMIa/iJoVkxIsjpqqnHRabzB6uN5Vy6VinY/Wukdpp2dJW\neAVjCy4AWeIe6D+8hoBL3nhIaA==\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-6p01o@myawe-91958.iam.gserviceaccount.com",
    client_id: "106988493002814302645",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6p01o%40myawe-91958.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
}

admin.initializeApp({ credential: admin.credential.cert(credentials) })

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
 
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly userRepository: IUserRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly courseRepository: ICourseRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly logger: Logger
    
    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
    ) {
        this.logger = new Logger('NotificationController')
        this.notiAddressRepository = new OrmNotificationAddressRepository( dataSource )
        this.uuidGenerator = new UuidGenerator()
        this.userRepository = new OrmUserRepository( new OrmUserMapper() , dataSource )
        this.notiAlertRepository = new OrmNotificationAlertRepository( dataSource )
        this.courseRepository = new OrmCourseRepository( 
            new OrmCourseMapper( new OrmSectionMapper(), new OrmTrainerMapper() ),
            new OrmSectionMapper(),
            new OrmSectionCommentMapper(),
            dataSource
        )
    }
    
    //@Cron(CronExpression.EVERY_DAY_AT_10AM)
    @Get('goodday')  
    async goodDayNotification() {
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new NotifyGoodDayApplicationService(
                    this.notiAlertRepository,
                    this.notiAddressRepository,
                    this.uuidGenerator
                ),
                new NativeLogger(this.logger)
            )    
        )
        return (await service.execute( { userId: 'none' } )).Value    
    }

    //@Cron(CronExpression.EVERY_12_HOURS)
    @Get('recommend')
    async recommendCoursesRandomNotification() {
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new NotifyRecommendCourseApplicationService(   
                    this.notiAlertRepository,
                    this.notiAddressRepository,
                    this.courseRepository,
                    this.uuidGenerator
                ),
                new NativeLogger(this.logger)
            )    
        )
        return (await service.execute( { userId: 'none' } )).Value
    }

    @Post('savetoken')
    //@UseGuards(JwtAuthGuard)
    @ApiOkResponse({ 
        description: 'Registrar el token de direccion de un usuario', 
        type: SaveTokenSwaggerResponseDto
    })
    //@ApiBearerAuth()
    async saveToken(@Body() saveTokenDto: SaveTokenDto) {
        const data = { userId: 'none', ...saveTokenDto }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new SaveTokenAddressApplicationService(
                    this.userRepository,
                    this.notiAlertRepository,
                    this.notiAddressRepository,
                    this.uuidGenerator
                ),
                new NativeLogger(this.logger)
            )    
        )
        return (await service.execute( data )).Value
    }

    @Post('getnotificationsuser')
    //@UseGuards(JwtAuthGuard)
    @ApiOkResponse({ 
        description: 'Obtener notificaciones recibidas por un usuario', 
        type: GetNotificationsUserSwaggerResponseDto 
    })
    ///@ApiBearerAuth()
    async getNotificationsUser(@Body() getNotiDto: GetNotificationsUserDto) {
        const data = { userId: 'none', ...getNotiDto }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new GetNotificationsUserByEmailApplicationService(
                    this.userRepository,
                    this.notiAlertRepository
                ),
                new NativeLogger(this.logger)
            )    
        )    
        return (await service.execute( data )).Value
    }

}