/* eslint-disable prettier/prettier */
import { Result } from 'src/common/Domain/result-handler/Result'
import { User } from '../user'

export interface IUserRepository {
  saveUserAggregate(user: User): Promise<Result<User>>;
  //findUserByEmail(email: string): Promise<Result<User>>;
  findUserById(id: string): Promise<Result<User>>;
  //updateUserPassword(email: string, newPassword: string): Promise<Result<User>>;
  deleteById(id: string): Promise<Result<User>>;
  findAllUser(): Promise<Result<User[]>>;
  getUserCount(): Promise<Result<number>>;
}
