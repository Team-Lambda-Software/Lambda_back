import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ICodeGenerator } from "../../../common/Application/code-generator/code-generator.interface";
import { IEmailSender } from "src/common/Application/email-sender/email-sender.interface.application";
import { ForgetPasswordEntryDto } from "./dto/entry/forget-password-entry.infraestructure.dto";
import { GetCodeServiceResponseDto } from "./dto/response/get-code-service-response";
import { IAccountRepository } from "src/user/application/interfaces/account-user-repository.interface";
import { OrmUser } from "src/user/infraestructure/entities/orm-entities/user.entity";

export class GetCodeUpdatePasswordUserInfraService implements IApplicationService<ForgetPasswordEntryDto, GetCodeServiceResponseDto> {

    private readonly accountRepository: IAccountRepository<OrmUser>
    private readonly emailSender: IEmailSender;
    private readonly codeGenerator: ICodeGenerator<string>; 
    constructor(
        accountRepository: IAccountRepository<OrmUser>,
        emailSender: IEmailSender,
        codeGenerator: ICodeGenerator<string>,
    ){
        this.accountRepository = accountRepository
        this.emailSender = emailSender
        this.codeGenerator = codeGenerator
    }
    
    async execute(forgetDto: ForgetPasswordEntryDto): Promise<Result<GetCodeServiceResponseDto>> {
        const result = await this.accountRepository.findUserByEmail( forgetDto.email )
        if ( !result.isSuccess() ) return Result.fail( result.Error, result.StatusCode, result.Message )
        const code = this.codeGenerator.generateCode(4)
        this.emailSender.setVariables( { firstname: result.Value.name, secretcode: code } )
        this.emailSender.sendEmail( forgetDto.email, forgetDto.email )
        const answer = { 
            email: forgetDto.email,
            code: code,
            date: new Date()
        }
        return Result.success(answer, 200)
    }
  
    get name(): string { return this.constructor.name }
}