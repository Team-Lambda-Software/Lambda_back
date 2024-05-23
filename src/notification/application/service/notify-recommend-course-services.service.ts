import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { INotificationAddressRepository } from "../../domain/repositories/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../domain/repositories/notification-alert-repository.interface";
import { RecommendCourseNotifier } from "src/notification/infraestructure/notifier/recommend-course-notifier";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { randomInt } from "crypto";
import { NotificationAlert } from "../../domain/entities/notification-alert";

export class NotifyRecommendCourseApplicationService implements IApplicationService<ApplicationServiceEntryDto, any> {
    
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly courseRepository: ICourseRepository
    private readonly uuidGenerator: UuidGenerator
    private recommendCourse = new RecommendCourseNotifier()

    constructor(
        notiAlertRepository: INotificationAlertRepository,
        notiAddressRepository: INotificationAddressRepository,     
        courseRepository: ICourseRepository,
        uuidGenerator: UuidGenerator
    ){
        this.notiAddressRepository = notiAddressRepository
        this.notiAlertRepository = notiAlertRepository
        this.uuidGenerator = uuidGenerator
        this.courseRepository = courseRepository    
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
        
        this.recommendCourse.setVariable(course)

        listTokens.forEach( async e => {
            try {
                const result = await this.recommendCourse.sendNotification( { token: e.Token } )
                if ( result.isSuccess() ) {
                    this.notiAlertRepository.saveNotificationAlert(
                        NotificationAlert.create(
                            await this.uuidGenerator.generateId(),
                            e.UserId,
                            "Recomendación del día!",
                            'Te recomendamos personalmente el curso de ' + course.Name
                        )
                    )
                }
            } catch (e) {}
        })
        return Result.success('recommend push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}