/* eslint-disable prettier/prettier */
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { User } from "src/user/domain/user"
import { OrmUser } from "../../entities/orm-entities/user.entity"
import { UserId } from 'src/user/domain/value-objects/user-id';
import { UserName } from 'src/user/domain/value-objects/user-name';
import { UserPhone } from 'src/user/domain/value-objects/user-phone';
import { UserEmail } from 'src/user/domain/value-objects/user-email';


export class OrmUserMapper implements IMapper<User, OrmUser> {
    async fromDomainToPersistence(domain: User): Promise<OrmUser> {
        const persistanceUser = OrmUser.create(
            domain.Id.Id,
            domain.Name.Name,
            domain.Phone.Phone,
            domain.Email?.Email
        )
        return persistanceUser
    }
    async fromPersistenceToDomain(persistence: OrmUser): Promise<User> {
        const domainUser = User.create(
            UserId.create(persistence.id),
            UserName.create(persistence.name),
            UserPhone.create(persistence.phone),
            persistence.email ? UserEmail.create(persistence.email) : null
        );
        return domainUser
    }
}