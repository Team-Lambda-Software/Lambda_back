import { Result } from "src/common/Application/result-handler/Result"
import { NotificationAlert } from "../entities/notification-alert"

export interface INotificationAlertRepository {
    findAllByIdUser ( userId: string ): Promise<Result<NotificationAlert[]>>
    saveNotificationAlert ( noti_address: NotificationAlert ): Promise<Result<NotificationAlert>>
}