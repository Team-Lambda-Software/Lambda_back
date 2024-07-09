import { Body, Controller, Inject, Ip, Logger, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { Get, Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { DataSource } from "typeorm";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { SaveTokenAddressInfraService } from "src/notification/infraestructure/service/notification-service/save-token-address-services.service";
import { NotifyGoodDayInfraService } from "src/notification/infraestructure/service/notification-service/notify-good-day-services.service";
import { NotifyRecommendCourseInfraService } from "src/notification/infraestructure/service/notification-service/notify-recommend-course-services.service";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { SaveTokenSwaggerResponseDto } from "./dto/response/save-token-address-swagger-response.dto";
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/Infraestructure/logger/logger";
import { FirebaseNotifier } from "../notifier/firebase-notifier-singleton";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { GetManyNotificationByUserInfraService } from "src/notification/infraestructure/service/query-service/get-notifications-by-user.service";
import { GetNumberNotificationNotSeenByUserInfraService } from "src/notification/infraestructure/service/query-service/get-notifications-count-not-readed.service";
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetNotificationByIdInfraService } from "../service/query-service/get-notification-by-notification-id.service";
import { GetNotificationsUserDto } from "./dto/entry/get-notifications-by-user.entry.dto";
import { GetNotReadedNotificationSwaggerResponse } from "./dto/response/get-not-readed.response.dto";
import { GetNotificationByNotificationIdSwaggerResponse } from "./dto/response/get-notification-by-id.response";
import { GetNotificationsUserSwaggerResponse } from "./dto/response/get-notifications-by-user.response.dto";
import { SaveTokenDto } from "./dto/entry/save-token.infraestructure.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OdmNotificationAddressEntity } from "../entities/odm-entities/odm-notification-address.entity";
import { OdmNotificationAlertEntity } from "../entities/odm-entities/odm-notification-alert.entity";
import { INotificationAlertRepository } from "../repositories/interface/notification-alert-repository.interface";
import { INotificationAddressRepository } from "../repositories/interface/notification-address-repository.interface";
import { OdmNotificationAddressRepository } from "../repositories/odm-notification-address-repository";
import { OdmNotificationAlertRepository } from "../repositories/odm-notification-alert-repository";
import { DeleteNotificationsInfraService } from "../service/notification-service/delete-notifications-services";
import { CourseQueryRepository } from "src/course/infraestructure/repositories/course-query-repository.interface";
import { OdmCourseRepository } from "src/course/infraestructure/repositories/odm-repositories/odm-course-repository";
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity";
import { OdmSectionCommentEntity } from "src/course/infraestructure/entities/odm-entities/odm-section-comment.entity";
import { IPushSender } from "src/common/Application/push-sender/push-sender.interface";

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
 
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly pushNotifier: IPushSender
    private readonly queryCourseRepository: CourseQueryRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly logger: Logger
    
    constructor(
        @Inject('DataSource') dataSource: DataSource,
        @InjectModel('NotificationAddress') private addressModel: Model<OdmNotificationAddressEntity>,
        @InjectModel('NotificationAlert') private alertModel: Model<OdmNotificationAlertEntity>,
        @InjectModel( 'Course' ) private readonly courseModel: Model<OdmCourseEntity>,
        @InjectModel( 'SectionComment' ) private readonly sectionCommentModel: Model<OdmSectionCommentEntity>,
    ) {
        this.logger = new Logger('NotificationController')
        this.notiAddressRepository = new OdmNotificationAddressRepository( addressModel )
        this.notiAlertRepository = new OdmNotificationAlertRepository( alertModel )
        this.uuidGenerator = new UuidGenerator()
        this.pushNotifier = FirebaseNotifier.getInstance()
        this.queryCourseRepository = new OdmCourseRepository( this.courseModel, this.sectionCommentModel)
    }

    @Get('count/not-readed')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ 
        description: 'Obtener la cantidad de notificaciones no vistas por el usuario', 
        type: GetNotReadedNotificationSwaggerResponse
    })
    @ApiBearerAuth()
    async getUserNotificationsNotReaded( @GetUser() user ) {
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new GetNumberNotificationNotSeenByUserInfraService(
                    this.notiAlertRepository
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        let entry = { userId: user.id }
        return (await service.execute(entry)).Value    
    }
    
    @Get('one/:id')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ 
        description: 'Obtener la notificacion dada el id de la notificacion', 
        type: GetNotificationByNotificationIdSwaggerResponse
    })
    @ApiBearerAuth()
    async getNotificationById( @Param('id', ParseUUIDPipe) id: string,  @GetUser() user ) {
        let dataentry = { notificationId: id, userId: user.id }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new GetNotificationByIdInfraService(
                    this.notiAlertRepository
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        return (await service.execute(dataentry)).Value   
    }
    
    @Get('many')
    @ApiOkResponse({ 
        description: 'Obtener notificaciones de un usuario', 
        type: GetNotificationsUserSwaggerResponse
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getNotificationsByUser( @Query() getNotifications:GetNotificationsUserDto, @GetUser() user ) {
        let dataentry={ ...getNotifications, userId: user.id }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new GetManyNotificationByUserInfraService(
                    this.notiAlertRepository
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        return (await service.execute(dataentry)).Value    
    }

    @Get('ip')
    async ipTester( @Ip() ipaddress ){
        return { ip : ipaddress }
    }

    @Post('tester')  
    async tester( @Body() dtoTester:{ title: string, body: string, icon: string }  ) {
        const findResult = await this.notiAddressRepository.findAllTokens()
        if ( !findResult.isSuccess() ) return 'no tokens'
        const listTokens = findResult.Value
        listTokens.forEach( async e => {
            const pushMessage = { token: e.token, notification: { title: dtoTester.title, body: dtoTester.body, icon: dtoTester.icon } }    
            const result = await this.pushNotifier.sendNotificationPush( pushMessage )
        })
        return 'tested'  
    }

    @Cron(CronExpression.EVERY_DAY_AT_7AM)
    @Get('goodday')  
    async goodDayNotification() {
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new NotifyGoodDayInfraService(
                    this.notiAddressRepository,
                    this.notiAlertRepository,
                    this.uuidGenerator,
                    this.pushNotifier
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()
        )
        return (await service.execute( { userId: 'none' } )).Value    
    }

    @Cron(CronExpression.EVERY_DAY_AT_1PM)
    @Get('recommend')
    async recommendCoursesRandomNotification() {
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new NotifyRecommendCourseInfraService( 
                    this.notiAddressRepository,  
                    this.notiAlertRepository,
                    this.queryCourseRepository,
                    this.uuidGenerator,
                    this.pushNotifier
                ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()    
        )
        return (await service.execute( { userId: 'none' } )).Value
    }

    @Post('savetoken')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Registrar el token de direccion de un usuario', type: SaveTokenSwaggerResponseDto })
    @ApiBearerAuth()
    async saveToken(@Body() saveTokenDto: SaveTokenDto, @GetUser() user) {
        const data = { userId: user.id, ...saveTokenDto }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new SaveTokenAddressInfraService( this.notiAddressRepository ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()   
        )
        await service.execute(data)
    }

    @Get('delete/all')
    @UseGuards(JwtAuthGuard)
    @ApiOkResponse({ description: 'Borrar notificationes de un usuario', type: SaveTokenSwaggerResponseDto })
    @ApiBearerAuth()
    async deleteTokens(@GetUser() user) {
        const data = { userId: user.id }
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new DeleteNotificationsInfraService( this.notiAlertRepository ),
                new NativeLogger(this.logger)
            ),
            new HttpExceptionHandler()   
        )
        await service.execute(data)
    }

}