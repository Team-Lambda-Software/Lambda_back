import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { NotificationAlert } from "src/notification/domain/entities/notification-alert"
import { OrmNotificationAlert } from "../../entities/orm-entities/orm-notification-alert"

export class OrmNotificationAlertMapper implements IMapper<NotificationAlert, OrmNotificationAlert> {
    
    async fromDomainToPersistence ( domain: NotificationAlert ): Promise<OrmNotificationAlert> {
        return OrmNotificationAlert.create( domain.Id, domain.UserId, domain.Title, domain.Message )
    }
    async fromPersistenceToDomain ( persistence: OrmNotificationAlert ): Promise<NotificationAlert> {
        return NotificationAlert.create( persistence.id, persistence.user_id, persistence.title, persistence.message )
    }

}
