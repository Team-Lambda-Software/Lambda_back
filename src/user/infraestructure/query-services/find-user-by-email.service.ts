/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { FindUserResponseDTO } from "./dto/response/find-user-by-id.service.response.dto";
import { Result } from "src/common/Domain/result-handler/Result";
import { OdmUserRepository } from "../repositories/odm-repository/odm-user-repository";
import { FindUserByEmailEntryDTO } from "./dto/params/find-user-by-email.service.entry.dto";

export class FindUserByEmail implements IApplicationService<FindUserByEmailEntryDTO,FindUserResponseDTO>{
    
    private readonly odmUserRepository: OdmUserRepository

    constructor(odmUserRepository: OdmUserRepository){
        this.odmUserRepository = odmUserRepository
    }
    
    async execute(data: FindUserByEmailEntryDTO): Promise<Result<FindUserResponseDTO>> {
       
        const userOdm = await this.odmUserRepository.findUserByEmail(data.email)

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
