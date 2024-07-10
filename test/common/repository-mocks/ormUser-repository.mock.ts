/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result";
import { IInfraUserRepository } from "src/user/application/interfaces/orm-infra-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";

export class OrmInfraUserRepositoryMock implements IInfraUserRepository {

    private readonly users: OrmUser[] = []

    async deleteById(id: string): Promise<Result<OrmUser>> {
        const index = this.users.findIndex(user => user.id === id);

        if (index !== -1) {
            const deletedUser = this.users.splice(index, 1)[0];
            return Result.success<OrmUser>(deletedUser, 200);
        } else {
            return Result.fail<OrmUser>(new Error('User not found'), 404, 'User not found');
        }
        
    }

    async findUserById(id: string): Promise<Result<OrmUser>> {
        const user = this.users.find(user => user.id === id)
        if (user) return Result.success<OrmUser>(user, 200)
        return Result.fail<OrmUser>(new Error('User not found'), 404, 'User not found')
    }

    async saveOrmUser(user: OrmUser): Promise<Result<OrmUser>> {
        this.users.push(user)
        return Result.success<OrmUser>(user, 200)
    }

    async findUserByEmail(email: string): Promise<Result<OrmUser>> {
        const user = this.users.find(user => user.email === email)
        if (user) return Result.success<OrmUser>(user, 200);
        return Result.fail<OrmUser>(new Error('User not found'), 404, 'User not found')
    }

    async updateUserPassword(email: string, newPassword: string): Promise<Result<OrmUser>> {
        const user = this.users.find(user => user.email === email)
        if (user) {
            user.password = newPassword;
            await this.users.push(user)
            return Result.success<OrmUser>(user, 200);
        }
        return Result.fail<OrmUser>(new Error('User not found'), 404, 'User not found');
    }

    async findAllUser(): Promise<Result<OrmUser[]>> {
        if (this.users.length > 0) {
            return Result.success<OrmUser[]>(this.users, 200);
        }
        return Result.fail<OrmUser[]>(new Error('Non-existing users'), 404, 'Non-existing users')
    }

}