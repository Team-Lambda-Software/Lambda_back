import { Result } from "src/common/Application/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OrmNotificationAlert } from "../../infraestructure/entities/orm-entities/orm-notification-alert"

export interface INotificationAlertRepository {
    findManyNotificationsByIdUser ( userId: string, pagDto: PaginationDto ): Promise<Result<OrmNotificationAlert[]>>
    saveNotificationAlert ( noti_alert: OrmNotificationAlert ): Promise<Result<OrmNotificationAlert>>
    findNotificationById(user_id: string, notification_id: string): Promise<Result<OrmNotificationAlert>>
    findAllByIdUserNotReaded(user_id: string): Promise<Result<OrmNotificationAlert[]>>
}