import { Result } from "src/common/Domain/result-handler/Result";
import { OrmUser } from "../../infraestructure/entities/orm-entities/user.entity";

export interface IInfraUserRepository {
    saveOrmUser(user: OrmUser): Promise<Result<OrmUser>>;
    findUserByEmail(email: string): Promise<Result<OrmUser>>;
    findUserById(id: string): Promise<Result<OrmUser>>;
    updateUserPassword(email: string, newPassword: string): Promise<Result<OrmUser>>;
    deleteById(id: string): Promise<Result<OrmUser>>;
    findAllUser(): Promise<Result<OrmUser[]>>;
}