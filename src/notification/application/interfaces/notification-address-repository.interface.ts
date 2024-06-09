import { Result } from "src/common/Application/result-handler/Result"
import { OrmNotificationAddress } from "../../infraestructure/entities/orm-entities/orm-notification-address"

export interface INotificationAddressRepository {
    findTokenByIdUser ( userId: string ): Promise<Result<OrmNotificationAddress>>
    saveNotificationAddress ( noti_address: OrmNotificationAddress ): Promise<Result<OrmNotificationAddress>>
    findAllTokens (): Promise<Result<OrmNotificationAddress[]>>
}