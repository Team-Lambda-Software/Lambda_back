import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { INotificationAddressRepository } from "../../infraestructure/repositories/interfaces/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../infraestructure/repositories/interfaces/notification-alert-repository.interface";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { randomInt } from "crypto";
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { PushNotificationDto } from "src/common/Application/notifier/dto/token-notification.dto";
import { OrmNotificationAlert } from "src/notification/infraestructure/entities/orm-entities/orm-notification-alert";

export class NotifyRecommendCourseApplicationService implements IApplicationService<ApplicationServiceEntryDto, any> {
    
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly courseRepository: ICourseRepository
    private readonly uuidGenerator: UuidGenerator
    private pushNotifier: INotifier
    
    constructor(
        notiAlertRepository: INotificationAlertRepository,
        notiAddressRepository: INotificationAddressRepository,     
        courseRepository: ICourseRepository,
        uuidGenerator: UuidGenerator,
        pushNotifier: INotifier
    ){
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
        this.courseRepository = courseRepository 
        this.pushNotifier = pushNotifier   
    }
    
    async execute(notifyDto: ApplicationServiceEntryDto): Promise<Result<any>> {
        const findResultTokens = await this.notiAddressRepository.findAllTokens()
        if ( !findResultTokens.isSuccess() )
            return Result.fail( new Error('Sin tokens registrados'), 500, 'Sin tokens registrados' )
        
        const findResultCourses = await this.courseRepository.findCoursesByName(' ', { perPage: 10, page: 0 })
        if ( !findResultCourses.isSuccess() )
            return Result.fail( new Error('Sin cursos registrados'), 500, 'Sin cursos registrados' )

        const listTokens = findResultTokens.Value
        const listCourses = findResultCourses.Value
        var ran = randomInt(0, listCourses.length)
        const course = listCourses[ran]

        listTokens.forEach( async e => {
            try {

                const pushMessage:PushNotificationDto = {
                    token: e.token,
                    notification: {
                        title: 'Recomendación del día!',
                        body: 'Te recomendamos personalmente el curso de ' + course.Name 
                    }
                }

                const result = await this.pushNotifier.sendNotification( pushMessage )
                if ( result.isSuccess() ) {
                    this.notiAlertRepository.saveNotificationAlert(
                        OrmNotificationAlert.create(
                            await this.uuidGenerator.generateId(),
                            e.user_id,
                            "Recomendación del día!",
                            'Te recomendamos personalmente el curso de ' + course.Name,
                            false,
                            new Date()
                        )
                    )
                }
            } catch (e) {}
        })
        return Result.success('recommend push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}