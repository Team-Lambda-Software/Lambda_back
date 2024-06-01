import { Result } from "src/common/Application/result-handler/Result"
import { Repository, DataSource } from 'typeorm'
import { OrmNotificationAlert } from "../entities/orm-entities/orm-notification-alert"
import { NotificationAlert } from "src/notification/domain/entities/notification-alert"
import { OrmNotificationAlertMapper } from "../mappers/orm-mappers/orm-notification-alert-mapper"
import { INotificationAlertRepository } from "src/notification/domain/repositories/notification-alert-repository.interface"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"

export class OrmNotificationAlertRepository extends Repository<OrmNotificationAlert> implements INotificationAlertRepository {

    private readonly ormNotificationAlertMapper: OrmNotificationAlertMapper

    constructor ( dataSource: DataSource ) {
        super( OrmNotificationAlert, dataSource.createEntityManager() )
        this.ormNotificationAlertMapper = new OrmNotificationAlertMapper()
    }

    async findManyNotificationsByIdUser(userId: string, pagDto: PaginationDto): Promise<Result<NotificationAlert[]>> {
        const OrmAlerts = await this.find( 
            { where: { user_id: userId }, skip: pagDto.page, take: pagDto.perPage, order: { date: 'DESC' } } 
        )
        if (OrmAlerts.length > 0) {
            const list_alerts: NotificationAlert[] = [];
            for(const alert of OrmAlerts) {
                list_alerts.push(await this.ormNotificationAlertMapper.fromPersistenceToDomain(alert))
            }
            return Result.success<NotificationAlert[]>(list_alerts, 200);
        }
        return Result.fail<NotificationAlert[]>( new Error( 'Non-existing user' ), 404, 'Non-existing user')    
    }
   
    async findNotificationById(user_id: string, notification_id: string): Promise<Result<NotificationAlert>> {
        const OrmAlerts = await this.findOneBy( { user_id: user_id, id: notification_id } )
        if ( OrmAlerts ) {
            const notiDomain = await this.ormNotificationAlertMapper.fromPersistenceToDomain( OrmAlerts )
            return Result.success<NotificationAlert>(notiDomain, 200);
        }
        return Result.fail<NotificationAlert>( new Error( 'Non-existing comment' ), 404, 'Non-existing comment')
    }

    async findAllByIdUserNotReaded(user_id: string): Promise<Result<NotificationAlert[]>> {
        const OrmAlerts = await this.find( { where: { user_id: user_id, userReaded: false }, order: { date: 'DESC' } } )
        if (OrmAlerts.length > 0){
            const list_alerts: NotificationAlert[] = [];
            for(const alert of OrmAlerts) {
                list_alerts.push(await this.ormNotificationAlertMapper.fromPersistenceToDomain(alert))
            }
            return Result.success<NotificationAlert[]>(list_alerts, 200);
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