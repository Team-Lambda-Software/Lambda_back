import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OdmNotificationAlertEntity } from "../../entities/odm-entities/odm-notification-alert.entity"

export interface NotiAlert {
    alert_id: string, 
    user_id: string, 
    title: string,
    body: string,
    date: Date,
    user_readed: boolean,
}

export interface INotificationAlertRepository {
    findManyNotificationsByIdUser(userId: string, pagDto: PaginationDto): Promise<Result<OdmNotificationAlertEntity[]>>
    saveNotificationAlert( data: NotiAlert ) 
    findNotificationById(user_id: string, notification_id: string): Promise<Result<OdmNotificationAlertEntity>>
    deleteNotificationsByUser(user_id: string): void
    findAllByIdUserNotReaded(user_id: string): Promise<Result<OdmNotificationAlertEntity[]>> 
}