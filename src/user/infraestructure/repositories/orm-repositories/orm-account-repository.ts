import { Result } from "src/common/Domain/result-handler/Result"
import { Repository, DataSource } from 'typeorm'
import { OrmUser } from "../../entities/orm-entities/user.entity"
import { IAccountRepository } from "src/user/application/interfaces/account-user-repository.interface";

export class OrmAccountRepository extends Repository<OrmUser> implements IAccountRepository<OrmUser> {

    constructor ( dataSource: DataSource ) {
        super( OrmUser, dataSource.createEntityManager() )
    }

    async saveUser(user: OrmUser): Promise<Result<boolean>> {
        try {
            await this.save( user )
            return Result.success<boolean>( true, 200 )
        } catch ( error ) {
            return Result.fail<boolean>( new Error( error.message ), error.code, error.message )
        }
    }
    
    async findAllUsers(): Promise<Result<OrmUser[]>> {
        const OrmUsers = await this.find()
        if(OrmUsers.length > 0){
            const list_users: OrmUser[] = [];
            for(const user of OrmUsers){ list_users.push(user) }
            return Result.success<OrmUser[]>(list_users,200);
        }
        return Result.fail<OrmUser[]>( new Error( 'Non-existing users' ), 404, 'Non-existing users')
    }

    async findUserById ( id: string ): Promise<Result<OrmUser>> {
        const user = await this.findOneBy( {id} )
        if ( user ) return Result.success<OrmUser>( user, 200 )
        return Result.fail<OrmUser>( new Error( 'User not found' ), 404, 'User not found')
    }

    async findUserByEmail ( email: string ): Promise<Result<OrmUser>> {
        const user = await this.findOneBy({email})
        if (user) return Result.success<OrmUser>(user,200);
        return Result.fail<OrmUser>(new Error('User not found'),404,'User not found');
    }

    async updateUserPassword ( email: string, newPassword: string ): Promise<Result<boolean>> {
        const user = await this.findOneBy({email});
        if (user) {
            user.password = newPassword;
            await this.save(user)
            return Result.success<boolean>(true, 200);
        }
        return Result.fail<boolean>(new Error('User not found'), 404,'User not found');
    }

}