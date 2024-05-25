import { Body, Controller, Inject, Logger, Query, UseGuards } from "@nestjs/common";
import { Get, Post } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { SaveTokenDto } from "../dto/entry/save-token.infraestructure.dto";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { OrmNotificationAddressRepository } from "../repositories/orm-notification-repository";
import { DataSource } from "typeorm";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { OrmUserRepository } from "src/user/infraestructure/repositories/orm-repositories/orm-user-repository";
import { OrmUserMapper } from "src/user/infraestructure/mappers/orm-mapper/orm-user-mapper";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository";
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper";
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper";
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper";
import { OrmNotificationAlertRepository } from "../repositories/orm-notification-alert-repository";
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { SaveTokenAddressApplicationService } from "src/notification/application/service/save-token-address-services.service";
import { NotifyGoodDayApplicationService } from "src/notification/application/service/notify-good-day-services.service";
import { NotifyRecommendCourseApplicationService } from "src/notification/application/service/notify-recommend-course-services.service";
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard";
import { SaveTokenSwaggerResponseDto } from "../dto/response/save-token-address-swagger-response.dto";
import { GetNotificationsUserSwaggerResponseDto } from "../dto/response/get-notifications-user-swagger-response.dto";
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator";
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator";
import { NativeLogger } from "src/common/Infraestructure/logger/logger";
import { INotificationAddressRepository } from "src/notification/domain/repositories/notification-address-repository.interface";
import { INotificationAlertRepository } from "src/notification/domain/repositories/notification-alert-repository.interface";
import { FirebaseNotifier } from "../notifier/firebase-notifier-singleton";
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator";

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
 
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly userRepository: IUserRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly courseRepository: ICourseRepository
    private readonly uuidGenerator: IdGenerator<string>
    private readonly logger: Logger
    private readonly pushNotifier: INotifier

    constructor(
        @Inject('DataSource') private readonly dataSource: DataSource,
    ) {
        this.logger = new Logger('NotificationController')
        this.notiAddressRepository = new OrmNotificationAddressRepository( dataSource )
        this.uuidGenerator = new UuidGenerator()
        this.userRepository = new OrmUserRepository( new OrmUserMapper() , dataSource )
        this.notiAlertRepository = new OrmNotificationAlertRepository( dataSource )
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
    async getUserNotificationsNotReaded( @GetUser() user ) {
    
    }
    
    @Get('one/:id')
    @UseGuards(JwtAuthGuard)
    async getNotificationById( @GetUser() user ) {
    
    }
    
    @Get('many')
    @UseGuards(JwtAuthGuard)
    async getNotificationsByUser( @Query() notReadedDto, @GetUser() user ) {
    
    }

    //@Cron(CronExpression.EVERY_DAY_AT_10AM)
    @Get('goodday')  
    async goodDayNotification() {
        const service = new ExceptionDecorator( 
            new LoggingDecorator(
                new NotifyGoodDayApplicationService(
                    this.notiAlertRepository,
                    this.notiAddressRepository,
                    this.uuidGenerator,
                    this.pushNotifier
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
                    this.uuidGenerator,
                    this.pushNotifier
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
                    this.uuidGenerator,
                    this.pushNotifier
                ),
                new NativeLogger(this.logger)
            )    
        )
        return (await service.execute( data )).Value
    }

}