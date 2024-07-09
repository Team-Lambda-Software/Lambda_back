/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result"
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity"; 
import { IAccountRepository } from "src/user/application/interfaces/account-user-repository.interface";

export class OrmAccountMockRepository implements IAccountRepository<OrmUser> {

    private readonly users: OrmUser[] = []

    async saveUser(user: OrmUser): Promise<Result<boolean>> {
        this.users.push( user )
        return Result.success<boolean>( true, 200 )
    }
    
    async findAllUsers(): Promise<Result<OrmUser[]>> {
        if(this.users.length > 0){
            return Result.success<OrmUser[]>(this.users,200);
        }
        return Result.fail<OrmUser[]>( new Error( 'Non-existing users' ), 404, 'Non-existing users')
    }

    async findUserById ( id: string ): Promise<Result<OrmUser>> {
        const user = this.users.find( user => user.id === id  )
        if ( user ) return Result.success<OrmUser>( user, 200 )
        return Result.fail<OrmUser>( new Error( 'User not found' ), 404, 'User not found')
    }

    async findUserByEmail ( email: string ): Promise<Result<OrmUser>> {
        const user = this.users.find( user => user.email === email  )
        if (user) return Result.success<OrmUser>(user,200);
        return Result.fail<OrmUser>(new Error('User not found'),404,'User not found');
    }

    async updateUserPassword ( email: string, newPassword: string ): Promise<Result<boolean>> {
        const user = this.users.find( user => user.email === email  )
        if (user) {
            user.password = newPassword;
            await this.users.push(user)
            return Result.success<boolean>(true, 200);
        }
        return Result.fail<boolean>(new Error('User not found'), 404,'User not found');
    }

}