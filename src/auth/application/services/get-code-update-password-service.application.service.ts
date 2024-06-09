import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { ICodeGenerator } from "../interface/code-generator.interface";
import { IEmailSender } from "src/common/Application/email-sender/email-sender.interface.application";
import { ForgetPasswordEntryApplicationDto } from "../dto/forget-password-entry.application.dto copy";
import { IInfraUserRepository } from "src/user/application/interfaces/orm-infra-user-repository.interface";

export class GetCodeUpdatePasswordUserApplicationService implements IApplicationService<ForgetPasswordEntryApplicationDto, any> {
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
    
    async execute(forgetDto: ForgetPasswordEntryApplicationDto): Promise<Result<any>> {
        const result = await this.userRepository.findUserByEmail( forgetDto.email )
        if ( !result.isSuccess() ) return Result.fail( new Error('Email not registered'), 400, 'Email not registered' )
        const code = this.codeGenerator.generateCode(4)
        this.emailSender.setVariables( { firstname: result.Value.name, secretcode: code } )
        this.emailSender.sendEmail( forgetDto.email, forgetDto.email )
        const answer = { 
            email: forgetDto.email,
            code: code,
            date: new Date().getTime() 
        }
        return Result.success(answer, 200)
    }
  
    get name(): string { return this.constructor.name }
}