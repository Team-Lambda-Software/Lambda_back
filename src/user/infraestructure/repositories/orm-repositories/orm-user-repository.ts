/* eslint-disable prettier/prettier */
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

    async deleteById(id: string): Promise<Result<User>> {

        const user = await this.findOneBy({id});

        if(user){
            await this.delete(user);
            return Result.success<User>(await this.ormUserMapper.fromPersistenceToDomain( user ), 200);
        }

        return Result.fail<User>(new Error('User not found'),404,'User not found')
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
            return Result.fail<User>( new Error( error.message ), error.code, error.message )
        }
    }

    async findUserByEmail ( email: string ): Promise<Result<User>>
    {
        const user = await this.findOneBy({email})
        if(user){
            return Result.success<User>(await this.ormUserMapper.fromPersistenceToDomain(user),200);
        }
        return Result.fail<User>(new Error('User not found'),404,'User not found');
    }

    async updateUserPassword ( email: string, newPassword: string ): Promise<Result<User>>
    {
        const user = await this.findOneBy({email});
        if(user){
            user.password = newPassword;
            await this.save(user)
            return Result.success<User>(await this.ormUserMapper.fromPersistenceToDomain(user),200);
        }
        return Result.fail<User>(new Error('User not found'),404,'User not found');
    }

    async findAllUser(): Promise<Result<User[]>>
    {

        const OrmUsers = await this.find()

        if(OrmUsers.length > 0){

            const list_users: User[] = [];

            for(const user of OrmUsers){
                list_users.push(await this.ormUserMapper.fromPersistenceToDomain(user))
            }

            return Result.success<User[]>(list_users,200);

        }

        return Result.fail<User[]>( new Error( 'Non-existing users' ), 404, 'Non-existing users')

    }
    async getUserCount(): Promise<Result<number>>
    {

        let usuarios_registrados: number = 0

        const OrmUsers = await this.findAllUser()

        if(!OrmUsers.isSuccess){
            return Result.fail<number>(OrmUsers.Error,OrmUsers.StatusCode,OrmUsers.Message)
        }

        usuarios_registrados = OrmUsers.Value.length;

       return Result.success<number>(usuarios_registrados,200)

    }
}