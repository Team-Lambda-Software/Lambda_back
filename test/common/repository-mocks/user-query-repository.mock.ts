/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { UserQueryRepository } from "src/user/infraestructure/repositories/user-query-repository.interface"


export class UserQueryRepositoryMock implements UserQueryRepository{
    
    private readonly users: OdmUserEntity[] = []
    
    async saveUser ( user: OdmUserEntity ): Promise<void>
    {
        this.users.push( user )
    }

    async findUserById ( userId: string ): Promise<Result<OdmUserEntity>>
    {
        const user = this.users.find( user => user.id === userId )
        if ( user ){
            return Result.success<OdmUserEntity>( user, 200)
        }
        return Result.fail<OdmUserEntity>( new Error( 'User not found' ), 404, 'User not found' )
    }

    async findUserByEmail ( email: string ): Promise<Result<OdmUserEntity>>
    {
        throw new Error( "Method not implemented." )
    }
    async findAllUser (): Promise<Result<OdmUserEntity[]>>
    {
        if(this.users.length > 0){
            return Result.success<OdmUserEntity[]>( this.users, 200 )
        }
        return Result.fail<OdmUserEntity[]>(new Error( "Not users." ),400,'Not users')
    }

}