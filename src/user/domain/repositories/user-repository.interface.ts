import { Result } from "src/common/Application/result-handler/Result"
import { User } from "../user"



export interface IUserRepository
{

    saveUserAggregate ( user: User ): Promise<Result<User>>
    findUserByEmail ( email: string ): Promise<Result<User>>
    updateUserPassword ( email:string, newPassword:string ): Promise<Result<User>>
    
}