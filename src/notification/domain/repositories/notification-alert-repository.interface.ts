import { Result } from "src/common/Domain/result-handler/Result"
import { NotificationAlert } from "../entities/notification-alert"

export interface INotificationAlertRepository {
    findAllByIdUser ( userId: string ): Promise<Result<NotificationAlert[]>>
    saveNotificationAlert ( noti_alert: NotificationAlert ): Promise<Result<NotificationAlert>>
}