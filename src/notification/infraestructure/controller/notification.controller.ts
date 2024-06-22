import { Body, Controller, Inject, Logger, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { Get, Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { DataSource } from "typeorm";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository";
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper";
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper";
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper";
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper";
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
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";
import { GetManyNotificationByUserInfraService } from "src/notification/infraestructure/service/query-service/get-notifications-by-user.service";
import { GetNumberNotificationNotSeenByUserInfraService } from "src/notification/infraestructure/service/query-service/get-notifications-count-not-readed.service";
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { OrmNotificationAlert } from "../entities/orm-entities/orm-notification-alert";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetNotificationByIdInfraService } from "../service/query-service/get-notification-by-notification-id.service";
import { GetNotificationsUserDto } from "./dto/entry/get-notifications-by-user.entry.dto";
import { GetNotReadedNotificationSwaggerResponse } from "./dto/response/get-not-readed.response.dto";
import { GetNotificationByNotificationIdSwaggerResponse } from "./dto/response/get-notification-by-id.response";
import { GetNotificationsUserSwaggerResponse } from "./dto/response/get-notifications-by-user.response.dto";
import { SaveTokenDto } from "./dto/entry/save-token.infraestructure.dto";
import { OdmNotificationAlertRepository } from "../repositories/alert-notification/odm-notification-alert-repository";
import { OdmNotificationAddressRepository } from "../repositories/address-notification/odm-notification-address-repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OdmNotificationAddressEntity } from "../entities/odm-entities/odm-notification-address.entity";
import { OdmNotificationAlertEntity } from "../entities/odm-entities/odm-notification-alert.entity";

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
 
    private readonly notiAddressRepository: OdmNotificationAddressRepository
    private readonly notiAlertRepository: OdmNotificationAlertRepository
    private readonly courseRepository: ICourseRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly logger: Logger
    private readonly pushNotifier: INotifier

    constructor(
        @Inject('DataSource') dataSource: DataSource,
        @InjectModel('NotificationAddress') private addressModel: Model<OdmNotificationAddressEntity>,
        @InjectModel('NotificationAlert') private alertModel: Model<OdmNotificationAlertEntity>,
    ) {
        this.logger = new Logger('NotificationController')
        this.notiAddressRepository = new OdmNotificationAddressRepository( addressModel )
        this.uuidGenerator = new UuidGenerator()
        this.notiAlertRepository = new OdmNotificationAlertRepository( alertModel )
        this.pushNotifier = FirebaseNotifier.getInstance()
        this.courseRepository = new OrmCourseRepository( 
            new OrmCourseMapper( new OrmSectionMapper(), new OrmTrainerMapper() ),
            new OrmSectionMapper(),
            new OrmSectionCommentMapper(),
            dataSource
        )
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

    @Post('tester')  
    async tester( @Body() dtoTester:{ title: string, body: string }  ) {
        const findResult = await this.notiAddressRepository.findAllTokens()
        if ( !findResult.isSuccess() ) return 'no tokens'
        const listTokens = findResult.Value
        listTokens.forEach( async e => {
            const pushMessage = { token: e.token, notification: { title: dtoTester.title, body: dtoTester.body } }    
            const result = await this.pushNotifier.sendNotification( pushMessage )
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
                    this.courseRepository,
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

}