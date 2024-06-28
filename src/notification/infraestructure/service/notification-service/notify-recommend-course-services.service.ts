import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator";
import { randomInt } from "crypto";
import { INotificationAddressRepository } from "../../repositories/interface/notification-address-repository.interface";
import { INotificationAlertRepository } from "../../repositories/interface/notification-alert-repository.interface";
import { CourseQueryRepository } from "src/course/infraestructure/repositories/course-query-repository.interface";
import { IPushSender } from "src/common/Application/push-sender/push-sender.interface";
import { PushNotificationDto } from "src/common/Application/push-sender/dto/token-notification.dto";

export class NotifyRecommendCourseInfraService implements IApplicationService<ApplicationServiceEntryDto, any> {
    
    private readonly notiAddressRepository: INotificationAddressRepository
    private readonly notiAlertRepository: INotificationAlertRepository
    private readonly courseRepository: CourseQueryRepository
    private readonly uuidGenerator: UuidGenerator
    private pushNotifier: IPushSender
    
    constructor(
        notiAddressRepository: INotificationAddressRepository,
        notiAlertRepository: INotificationAlertRepository,
        courseRepository: CourseQueryRepository,
        uuidGenerator: UuidGenerator,
        pushNotifier: IPushSender
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
        
        const pushTitle = 'Recommendation of the day'
        const pushBody = 'We recommend you ' + course.name

        listTokens.forEach( async e => {
            const pushMessage:PushNotificationDto = { token: e.token, notification: { title: pushTitle, body: pushBody }}
            const result = await this.pushNotifier.sendNotificationPush( pushMessage )
            //if ( result.isSuccess() ) {
            this.notiAlertRepository.saveNotificationAlert({
                alert_id: await this.uuidGenerator.generateId(), 
                user_id: e.user_id, 
                title: pushTitle, 
                body:  pushBody,
                date: new Date(), 
                user_readed: false 
            })
        })
        return Result.success('recommend push sended', 200)
    }
   
    get name(): string { return this.constructor.name }
}