/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { FindUserByIdEntryDTO } from "./dto/params/find-user-by-id.service.entry.dto";
import { FindUserResponseDTO } from "./dto/response/find-user-by-id.service.response.dto";
import { Result } from "src/common/Domain/result-handler/Result";
import { OdmUserRepository } from "../repositories/odm-repository/odm-user-repository";

export class FindUserById implements IApplicationService<FindUserByIdEntryDTO,FindUserResponseDTO>{
    
    private readonly odmUserRepository: OdmUserRepository

    constructor(odmUserRepository: OdmUserRepository){
        this.odmUserRepository = odmUserRepository
    }
    
    async execute(data: FindUserByIdEntryDTO): Promise<Result<FindUserResponseDTO>> {
        const userOdm = await this.odmUserRepository.findUserById(data.userId)

        if(!userOdm.isSuccess()){
            return Result.fail<FindUserResponseDTO>(userOdm.Error,userOdm.StatusCode,userOdm.Message)
        }

        const userResult = userOdm.Value

        const response: FindUserResponseDTO = {
            id: userResult.id,
            name: userResult.name,
            email: userResult.email,
            password: userResult.password,
            type: userResult.type,
            image: userResult.image,
            phone: userResult.phone
        }

        return Result.success<FindUserResponseDTO>(response,200)

    }

    get name(): string {
        return this.constructor.name
    }
    
}
