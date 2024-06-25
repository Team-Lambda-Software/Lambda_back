/* eslint-disable prettier/prettier */
import { Result } from "src/common/Domain/result-handler/Result";
import { OdmUserEntity } from "../entities/odm-entities/odm-user.entity";

export interface UserQueryRepository{

    saveUser(user: OdmUserEntity): Promise<void>

    findUserById(userId: string): Promise<Result<OdmUserEntity>>;

    findUserByEmail(email: string): Promise<Result<OdmUserEntity>>;

    findAllUser(): Promise<Result<OdmUserEntity[]>>;

}