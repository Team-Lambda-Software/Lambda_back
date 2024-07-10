import { Model } from "mongoose"
import { Result } from "src/common/Domain/result-handler/Result"
import { INotificationAddressRepository, NotiAddress } from "./interface/notification-address-repository.interface"
import { OdmNotificationAddressEntity } from "../entities/odm-entities/odm-notification-address.entity"

export class OdmNotificationAddressRepository implements INotificationAddressRepository {

    private readonly notiModel: Model<OdmNotificationAddressEntity>
    constructor ( notiModel: Model<OdmNotificationAddressEntity>) {
        this.notiModel = notiModel
    }

    async findTokenByIdUser(userId: string): Promise<Result<OdmNotificationAddressEntity>> {
        try {
            const noti = await this.notiModel.findOne( { user_id: userId } )
            return Result.success<OdmNotificationAddressEntity>( noti, 200 )
        } catch (error) {
            return Result.fail<OdmNotificationAddressEntity>( error, 500, "Error buscando PushToken" )
        }
    }

    async saveNotificationAddress(noti_address: NotiAddress) {
        const findNoti = await this.notiModel.findOne( { token: noti_address.token } )
        if ( !findNoti ) {
            const noti = new this.notiModel(noti_address)
            await this.notiModel.create( noti )
        } else {
            findNoti.user_id = noti_address.user_id
            await this.notiModel.create( findNoti )
        }
    }
    
    async findAllTokens(): Promise<Result<OdmNotificationAddressEntity[]>> {
        try {
            const noti = await this.notiModel.find()
            return Result.success<OdmNotificationAddressEntity[]>( noti, 200 )
        } catch (error) {
            return Result.fail<OdmNotificationAddressEntity[]>( error, 500, "Error buscando PushToken" )
        }
    }

}