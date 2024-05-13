import { Result } from "src/common/Application/result-handler/Result"
import { Repository, DataSource } from 'typeorm'
import { OrmNotificationAddress } from "../entities/orm-entities/orm-notification-address"
import { INotificationAddressRepository } from "src/notification/domain/repositories/notification-address-repository.interface"
import { NotificationAddress } from "src/notification/domain/entities/notification-address"
import { OrmNotificationAddressMapper } from "../mappers/orm-mappers/orm-notification-address-mapper"

export class OrmNotificationAddressRepository extends Repository<OrmNotificationAddress> implements INotificationAddressRepository {

    private readonly ormNotificationAddressMapper: OrmNotificationAddressMapper

    constructor ( dataSource: DataSource ) {
        super( OrmNotificationAddress, dataSource.createEntityManager() )
        this.ormNotificationAddressMapper = new OrmNotificationAddressMapper()
    }

    async findAllTokens(): Promise<Result<NotificationAddress[]>> {
        const OrmAddress = await this.find()
        if(OrmAddress.length > 0){
            const list_address: NotificationAddress[] = [];
            for(const address of OrmAddress) {
                list_address.push(await this.ormNotificationAddressMapper.fromPersistenceToDomain(address))
            }
            return Result.success<NotificationAddress[]>(list_address,200);
        }
        return Result.fail<NotificationAddress[]>( new Error( 'Non-existing tokens' ), 404, 'Non-existing tokens')
    }

    async saveNotificationAddress(noti_address: NotificationAddress): Promise<Result<NotificationAddress>> {
        try {
            const ormNoti = await this.ormNotificationAddressMapper.fromDomainToPersistence( noti_address )
            await this.save( ormNoti )
            return Result.success<NotificationAddress>( noti_address, 200 )
        } catch ( error ) {
            console.log(error)
            return Result.fail<NotificationAddress>( new Error( error.detail ), error.code, error.detail )
        }
    }
    async findTokenByIdUser(user_id: string): Promise<Result<NotificationAddress>> {
        try {
            const not_address = await this.findOneBy( { user_id } )
            if ( not_address ) 
                return Result.success<NotificationAddress>( await this.ormNotificationAddressMapper.fromPersistenceToDomain( not_address ), 200 )
            return Result.fail<NotificationAddress>( new Error( 'noti_address not found' ), 404, 'noti_address not found' )
        } catch ( error ) {
            return Result.fail<NotificationAddress>( new Error( error.detail ), error.code, error.detail )
        }
    }   

}