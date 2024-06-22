import { Result } from "src/common/Domain/result-handler/Result"
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface"
import { User } from "src/user/domain/user"



export class UserMockRepository implements IUserRepository{

    private readonly users: User[] = []

    async saveUserAggregate ( user: User ): Promise<Result<User>>
    {
        this.users.push( user )
        return Result.success<User>( user, 200 )
    }
    async findUserById ( id: string ): Promise<Result<User>>
    {
        const user = this.users.find( user => user.Id.Id === id )
        if( user === undefined )
        {
            return Result.fail<User>(new Error(`User with id ${id} not found`) ,404,`User with id ${id} not found`)
        }
        return Result.success<User>( user , 200 )   
    }
    deleteById ( id: string ): Promise<Result<User>>
    {
        throw new Error( "Method not implemented." )
    }
    findAllUser (): Promise<Result<User[]>>
    {
        throw new Error( "Method not implemented." )
    }
    getUserCount (): Promise<Result<number>>
    {
        throw new Error( "Method not implemented." )
    }

}