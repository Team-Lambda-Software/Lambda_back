import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { randomInt } from "crypto";
import { INotifier } from "src/common/Application/notifier/notifier.application";
import { PushNotificationDto } from "src/common/Application/notifier/dto/token-notification.dto";
import { INotificationAddressRepository } from "../../repositories/interface/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface";
import { CourseQueryRepository } from "src/course/infraestructure/repositories/course-query-repository.interface";

export class NotifyRecommendCourseInfraService implements IApplicationService<ApplicationServiceEntryDto, any> {
    
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly courseRepository: CourseQueryRepository
    private readonly uuidGenerator: UuidGenerator
    private pushNotifier: INotifier
    
    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        courseRepository: CourseQueryRepository,
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
        if ( !findResultTokens.isSuccess() ) return Result.fail(findResultTokens.Error, findResultTokens.StatusCode, findResultTokens.Message)

        const findResultCourses = await this.courseRepository.findCoursesByTagsAndName([], '', { perPage: 0, page: 0 })
        if ( !findResultCourses.isSuccess() ) return Result.fail(findResultCourses.Error, findResultCourses.StatusCode, findResultCourses.Message)

        const listTokens = findResultTokens.Value
        const listCourses = findResultCourses.Value
        var ran = randomInt(0, listCourses.length)
        const course = listCourses[ran]

        listTokens.forEach( async e => {
            const pushMessage:PushNotificationDto = { token: e.token, notification: { title: 'Recommendation of the day', body: 'We recommend you ' + course.name}}
            const result = await this.pushNotifier.sendNotification( pushMessage )
            //if ( result.isSuccess() ) {
            this.notiAlertRepository.saveNotificationAlert({
                alert_id: await this.uuidGenerator.generateId(), 
                user_id: e.user_id, 
                title: 'Recommendation of the day', 
                body: 'We recommend you ' + course.name, 
                date: new Date(), 
                user_readed: false 
            })
        })
        return Result.success('recommend push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}