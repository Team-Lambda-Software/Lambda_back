import { Result } from "src/common/Domain/result-handler/Result"
import { Repository, DataSource } from 'typeorm'
import { OrmNotificationAlert } from "../../entities/orm-entities/orm-notification-alert"
import { INotificationAlertRepository } from "src/notification/application/repositories/notification-alert-repository.interface"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"

export class OrmNotificationAlertRepository extends Repository<OrmNotificationAlert> implements INotificationAlertRepository {

    constructor ( dataSource: DataSource ) {
        super( OrmNotificationAlert, dataSource.createEntityManager() )
    }

    async findManyNotificationsByIdUser(userId: string, pagDto: PaginationDto): Promise<Result<OrmNotificationAlert[]>> {
        const OrmAlerts = await this.find({ where: { user_id: userId }, skip: pagDto.page, take: pagDto.perPage })
        const list_alerts: OrmNotificationAlert[] = [];
        for(const alert of OrmAlerts) { list_alerts.push(alert) }
        return Result.success<OrmNotificationAlert[]>(list_alerts, 200);
    }
   
    async findNotificationById(user_id: string, notification_id: string): Promise<Result<OrmNotificationAlert>> {
        const OrmAlerts = await this.findOneBy( { user_id: user_id, id: notification_id } )
        if ( OrmAlerts ) return Result.success<OrmNotificationAlert>(OrmAlerts, 200);
        return Result.fail<OrmNotificationAlert>( new Error( 'Non-existing notification' ), 404, 'Non-existing notification')
    }

    async findAllByIdUserNotReaded(user_id: string): Promise<Result<OrmNotificationAlert[]>> {
        const OrmAlerts = await this.find( { where: { user_id: user_id, userReaded: false }, order: { date: 'DESC' } } )
        const list_alerts: OrmNotificationAlert[] = [];
        for (const alert of OrmAlerts) { list_alerts.push( alert ) }
        return Result.success<OrmNotificationAlert[]>(list_alerts, 200);    
    }
    
    async saveNotificationAlert(noti_alert: OrmNotificationAlert): Promise<Result<OrmNotificationAlert>> {
        try {
            await this.save( noti_alert )
            return Result.success<OrmNotificationAlert>( noti_alert, 200 )
        } catch ( error ) {
            return Result.fail<OrmNotificationAlert>( new Error( error.message ), error.code, error.message )
        }
    }

}