/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result"
import { IAccountRepository } from "src/user/application/interfaces/account-user-repository.interface";
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity";

export class OdmAccountMockRepository implements IAccountRepository<OdmUserEntity> {

    private readonly users: OdmUserEntity[] = []

    async updateUserPassword(email: string, newPassword: string): Promise<Result<boolean>> {
        const index = this.users.findIndex(user => user.email === email);

        if (index !== -1) {
            this.users[index].password = newPassword;
            return Result.success<boolean>(true, 200);
        } else {
            return Result.fail<boolean>(null, 404, "User not found");
        }

    }

    async findAllUsers(): Promise<Result<OdmUserEntity[]>> {
        if(this.users.length > 0){
            return Result.success<OdmUserEntity[]>(this.users, 200);
        }
        return Result.fail<OdmUserEntity[]>(new Error('Not users found'),400,'Not users found')
    }

    async saveUser(user: OdmUserEntity): Promise<Result<boolean>> {
        this.users.push(user)
        return Result.success<boolean>(true,200)
    }

    async findUserById(userId: string): Promise<Result<OdmUserEntity>> {
        const user = this.users.find( user => user.id === userId )
        if( user === undefined )
        {
            return Result.fail<OdmUserEntity>(new Error(`User with id ${userId} not found`) ,404,`User with id ${userId} not found`)
        }
        return Result.success<OdmUserEntity>( user , 200 )  
    }

    async findUserByEmail(email: string): Promise<Result<OdmUserEntity>> {
        const user = this.users.find( user => user.email === email  )
        if( user === undefined )
            return Result.fail<OdmUserEntity>(new Error(`User with email ${email} not found`) ,404,`User with email ${email} not found`)    
        return Result.success<OdmUserEntity>( user , 200 )   
    }

}