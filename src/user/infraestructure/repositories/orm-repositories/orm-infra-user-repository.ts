import { Result } from "src/common/Application/result-handler/Result"
import { Repository, DataSource } from 'typeorm'
import { OrmUser } from "../../entities/orm-entities/user.entity"
import { IInfraUserRepository } from "../interfaces/orm-infra-user-repository.interface"

export class OrmInfraUserRepository extends Repository<OrmUser> implements IInfraUserRepository {

    constructor ( dataSource: DataSource ) {
        super( OrmUser, dataSource.createEntityManager() )
    }

    async deleteById(id: string): Promise<Result<OrmUser>> {
        const user = await this.findOneBy({id});
        if (user) {
            await this.delete(user);
            return Result.success<OrmUser>(user, 200);
        }
        return Result.fail<OrmUser>(new Error('User not found'),404,'User not found')
    }

    async findUserById ( id: string ): Promise<Result<OrmUser>> {
        const user = await this.findOneBy( {id} )
        if ( user ) return Result.success<OrmUser>( user, 200 )
        return Result.fail<OrmUser>( new Error( 'User not found' ), 404, 'User not found')
    }

    async saveOrmUser ( user: OrmUser ): Promise<Result<OrmUser>> {
        try {
            await this.save( user )
            return Result.success<OrmUser>( user, 200 )
        } catch ( error ) {
            return Result.fail<OrmUser>( new Error( error.message ), error.code, error.message )
        }
    }

    async findUserByEmail ( email: string ): Promise<Result<OrmUser>> {
        const user = await this.findOneBy({email})
        if (user) return Result.success<OrmUser>(user,200);
        return Result.fail<OrmUser>(new Error('User not found'),404,'User not found');
    }

    async updateUserPassword ( email: string, newPassword: string ): Promise<Result<OrmUser>> {
        const user = await this.findOneBy({email});
        if (user) {
            user.password = newPassword;
            await this.save(user)
            return Result.success<OrmUser>(user, 200);
        }
        return Result.fail<OrmUser>(new Error('User not found'), 404,'User not found');
    }

    async findAllUser(): Promise<Result<OrmUser[]>> {
        const OrmUsers = await this.find()
        if(OrmUsers.length > 0){
            const list_users: OrmUser[] = [];
            for(const user of OrmUsers){ list_users.push(user) }
            return Result.success<OrmUser[]>(list_users,200);
        }
        return Result.fail<OrmUser[]>( new Error( 'Non-existing users' ), 404, 'Non-existing users')
    }
}