import { Result } from "src/common/Application/result-handler/Result"
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface"
import { User } from "src/user/domain/user"
import { Repository, DataSource } from 'typeorm'
import { OrmUser } from "../../entities/orm-entities/user.entity"
import { OrmUserMapper } from '../../mappers/orm-mapper/orm-user-mapper'


export class OrmUserRepository extends Repository<OrmUser> implements IUserRepository
{

    private readonly ormUserMapper: OrmUserMapper

    constructor ( ormUserMapper: OrmUserMapper, dataSource: DataSource )
    {
        super( OrmUser, dataSource.createEntityManager() )
        this.ormUserMapper = ormUserMapper
    }

    async findUserById ( id: string ): Promise<Result<User>>
    {
        const user = await this.findOneBy( {id} )
        if ( user )
        {
            return Result.success<User>( await this.ormUserMapper.fromPersistenceToDomain( user ), 200 )
        }
        return Result.fail<User>( new Error( 'User not found' ), 404, 'User not found')
    }

    async saveUserAggregate ( user: User ): Promise<Result<User>>
    {
        try
        {
            const ormUser = await this.ormUserMapper.fromDomainToPersistence( user )
            
            await this.save( ormUser )
            
            return Result.success<User>( user, 200 )
        } catch ( error )
        {
            return Result.fail<User>( new Error( error.detail ), error.code, error.detail )
        }
    }
    findUserByEmail ( email: string ): Promise<Result<User>>
    {
        throw new Error( "Method not implemented." )
    }
    updateUserPassword ( email: string, newPassword: string ): Promise<Result<User>>
    {
        throw new Error( "Method not implemented." )
    }

}