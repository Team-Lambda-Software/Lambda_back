import { Result } from "src/common/Domain/result-handler/Result"
import { Repository, DataSource } from 'typeorm'
import { OrmNotificationAddress } from "../../entities/orm-entities/orm-notification-address"

export class OrmNotificationAddressRepository extends Repository<OrmNotificationAddress> {

    constructor ( dataSource: DataSource ) {
        super( OrmNotificationAddress, dataSource.createEntityManager() )
    }

    async findAllTokens(): Promise<Result<OrmNotificationAddress[]>> {
        const OrmAddress = await this.find()
        if (OrmAddress.length > 0){
            const list_address: OrmNotificationAddress[] = [];
            for (const address of OrmAddress) { list_address.push(address) }
            return Result.success<OrmNotificationAddress[]>(list_address,200);
        }
        return Result.fail<OrmNotificationAddress[]>( new Error( 'Non-existing tokens' ), 404, 'Non-existing tokens')
    }

    async saveNotificationAddress(noti_address: OrmNotificationAddress): Promise<Result<OrmNotificationAddress>> {
        try {
            await this.save( noti_address )
            return Result.success<OrmNotificationAddress>( noti_address, 200 )
        } catch ( error ) {
            return Result.fail<OrmNotificationAddress>( new Error( error.message ), error.code, error.message )
        }
    }
    async findTokenByIdUser(user_id: string): Promise<Result<OrmNotificationAddress>> {
        try {
            const not_address = await this.findOneBy( { user_id } )
            if ( not_address ) return Result.success<OrmNotificationAddress>(not_address, 200 )
            return Result.fail<OrmNotificationAddress>( new Error( 'noti_address not found' ), 404, 'noti_address not found' )
        } catch ( error ) {
            return Result.fail<OrmNotificationAddress>( new Error( error.message ), error.code, error.message )
        }
    }   

}