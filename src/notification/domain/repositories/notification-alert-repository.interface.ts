import { Result } from "src/common/Application/result-handler/Result"
import { NotificationAlert } from "../entities/notification-alert"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"

export interface INotificationAlertRepository {
    findManyNotificationsByIdUser ( userId: string, pagDto: PaginationDto ): Promise<Result<NotificationAlert[]>>
    saveNotificationAlert ( noti_alert: NotificationAlert ): Promise<Result<NotificationAlert>>
    findNotificationById(user_id: string, notification_id: string): Promise<Result<NotificationAlert>>
    findAllByIdUserNotReaded(user_id: string): Promise<Result<NotificationAlert[]>>
}