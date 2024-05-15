import { Result } from "src/common/Application/result-handler/Result"
import { NotificationAddress } from "../entities/notification-address"

export interface INotificationAddressRepository {
    findTokenByIdUser ( userId: string ): Promise<Result<NotificationAddress>>
    saveNotificationAddress ( noti_address: NotificationAddress ): Promise<Result<NotificationAddress>>
    findAllTokens (): Promise<Result<NotificationAddress[]>>
}