/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { User } from "src/user/domain/user"
import { OdmUserEntity } from "../../entities/odm-entities/odm-user.entity"
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { UserId } from "src/user/domain/value-objects/user-id"
import { UserName } from "src/user/domain/value-objects/user-name"
import { UserPhone } from "src/user/domain/value-objects/user-phone"
import { UserEmail } from "src/user/domain/value-objects/user-email"


export class OdmUserMapper implements IMapper<User, OdmUserEntity>
{
    fromDomainToPersistence ( domain: User ): Promise<OdmUserEntity>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( user: OdmUserEntity ): Promise<User>
    {
        return User.create(
            UserId.create(user.id),
            UserName.create(user.name),
            UserPhone.create(user.phone),
            UserEmail.create(user.email)
        )
    }
    
}