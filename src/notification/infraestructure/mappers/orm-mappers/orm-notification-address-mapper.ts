import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { NotificationAddress } from "src/notification/domain/entities/notification-address"
import { OrmNotificationAddress } from "../../entities/orm-entities/orm-notification-address"

export class OrmNotificationAddressMapper implements IMapper<NotificationAddress, OrmNotificationAddress> {
    
    async fromDomainToPersistence ( domain: NotificationAddress ): Promise<OrmNotificationAddress> {
        return OrmNotificationAddress.create( domain.Id, domain.UserId, domain.Token )
    }
    async fromPersistenceToDomain ( persistence: OrmNotificationAddress ): Promise<NotificationAddress> {
        return NotificationAddress.create( persistence.id, persistence.user_id, persistence.token )
    }

}
