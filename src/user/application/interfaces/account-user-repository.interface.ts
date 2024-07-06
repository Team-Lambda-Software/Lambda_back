import { Result } from "src/common/Domain/result-handler/Result";

export interface IAccountRepository<T> {
    saveUser(user: T): Promise<Result<boolean>>;
    findUserByEmail(email: string): Promise<Result<T>>;
    findUserById(id: string): Promise<Result<T>>;
    updateUserPassword(email: string, newPassword: string): Promise<Result<boolean>>;
    findAllUsers(): Promise<Result<T[]>>;
}