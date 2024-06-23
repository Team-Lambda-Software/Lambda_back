import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ICodeGenerator } from "../../../common/Application/code-generator/code-generator.interface";
import { IEmailSender } from "src/common/Application/email-sender/email-sender.interface.application";
import { IInfraUserRepository } from "src/user/application/interfaces/orm-infra-user-repository.interface";
import { ForgetPasswordEntryDto } from "./dto/entry/forget-password-entry.infraestructure.dto";
import { GetCodeServiceResponseDto } from "./dto/response/get-code-service-response";

export class GetCodeUpdatePasswordUserInfraService implements IApplicationService<ForgetPasswordEntryDto, GetCodeServiceResponseDto> {
    private readonly userRepository: IInfraUserRepository   
    private readonly emailSender: IEmailSender;
    private readonly codeGenerator: ICodeGenerator<string>; 
    constructor(
        userRepository: IInfraUserRepository,
        emailSender: IEmailSender,
        codeGenerator: ICodeGenerator<string>,
    ){
        this.userRepository = userRepository
        this.emailSender = emailSender
        this.codeGenerator = codeGenerator
    }
    
    async execute(forgetDto: ForgetPasswordEntryDto): Promise<Result<GetCodeServiceResponseDto>> {
        const result = await this.userRepository.findUserByEmail( forgetDto.email )
        if ( !result.isSuccess() ) return Result.fail( new Error('Email not registered'), 400, 'Email not registered' )
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