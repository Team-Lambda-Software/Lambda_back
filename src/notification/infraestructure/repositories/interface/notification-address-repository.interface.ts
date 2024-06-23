import { Result } from "src/common/Domain/result-handler/Result"
import { OdmNotificationAddressEntity } from "../../entities/odm-entities/odm-notification-address.entity"

export interface NotiAddress {
    token: string
    user_id: string
}

export interface INotificationAddressRepository {
    findTokenByIdUser(userId: string): Promise<Result<OdmNotificationAddressEntity>>
    saveNotificationAddress(noti_address: NotiAddress)
    findAllTokens(): Promise<Result<OdmNotificationAddressEntity[]>>

}