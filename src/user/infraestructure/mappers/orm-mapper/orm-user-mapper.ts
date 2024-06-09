/* eslint-disable prettier/prettier */
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { User } from "src/user/domain/user"
import { OrmUser } from "../../entities/orm-entities/user.entity"




export class OrmUserMapper implements IMapper<User, OrmUser>
{
    async fromDomainToPersistence ( domain: User ): Promise<OrmUser>
    {
        const persistanceUser = OrmUser.create(
            domain.Id,
            domain.Phone,
            domain.Name,
            domain.Image
        )
        return persistanceUser
    }
    async fromPersistenceToDomain ( persistence: OrmUser ): Promise<User>
    {
        const domainUser = User.create( persistence.id, persistence.name, persistence.phone, persistence.image )
        return domainUser
    }
}