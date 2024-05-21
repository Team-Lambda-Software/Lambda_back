import { Result } from "src/common/Domain/result-handler/Result"
import { Repository, DataSource } from 'typeorm'
import { OrmNotificationAlert } from "../entities/orm-entities/orm-notification-alert"
import { NotificationAlert } from "src/notification/domain/entities/notification-alert"
import { OrmNotificationAlertMapper } from "../mappers/orm-mappers/orm-notification-alert-mapper"
import { INotificationAlertRepository } from "src/notification/domain/repositories/notification-alert-repository.interface"

export class OrmNotificationAlertRepository extends Repository<OrmNotificationAlert> implements INotificationAlertRepository {

    private readonly ormNotificationAlertMapper: OrmNotificationAlertMapper

    constructor ( dataSource: DataSource ) {
        super( OrmNotificationAlert, dataSource.createEntityManager() )
        this.ormNotificationAlertMapper = new OrmNotificationAlertMapper()
    }

    async findAllByIdUser(user_id: string): Promise<Result<NotificationAlert[]>> {
        const OrmAlerts = await this.find( { where: { user_id: user_id } } )
        if(OrmAlerts.length > 0){
            const list_address: NotificationAlert[] = [];
            for(const address of OrmAlerts) {
                list_address.push(await this.ormNotificationAlertMapper.fromPersistenceToDomain(address))
            }
            return Result.success<NotificationAlert[]>(list_address,200);
        }
        return Result.fail<NotificationAlert[]>( new Error( 'Non-existing user' ), 404, 'Non-existing user')
    }
    
    async saveNotificationAlert(noti_alert: NotificationAlert): Promise<Result<NotificationAlert>> {
        try {
            const ormNoti = await this.ormNotificationAlertMapper.fromDomainToPersistence( noti_alert )
            await this.save( ormNoti )
            return Result.success<NotificationAlert>( noti_alert, 200 )
        } catch ( error ) {
            return Result.fail<NotificationAlert>( new Error( error.message ), error.code, error.message )
        }
    }

}