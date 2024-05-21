import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { ICodeGenerator } from "../interface/code-generator.interface";
import { IEmailSender } from "src/common/Application/email-sender/email-sender.interface.application";
import { ForgetPasswordEntryApplicationDto } from "../dto/forget-password-entry.application.dto copy";

export class GetCodeUpdatePasswordUserApplicationService implements IApplicationService<ForgetPasswordEntryApplicationDto, any> {
    private readonly userRepository: IUserRepository   
    private readonly emailSender: IEmailSender;
    private readonly codeGenerator: ICodeGenerator<string>; 
    constructor(
        userRepository: IUserRepository,
        emailSender: IEmailSender,
        codeGenerator: ICodeGenerator<string>,
    ){
        this.userRepository = userRepository
        this.emailSender = emailSender
        this.codeGenerator = codeGenerator
    }
    
    async execute(forgetDto: ForgetPasswordEntryApplicationDto): Promise<Result<any>> {
        const result = await this.userRepository.findUserByEmail( forgetDto.email )
        if ( !result.isSuccess() ) 
            return Result.fail( new Error('Cuenta no existente'), 500, 'Cuenta no existente' )
        const code = this.codeGenerator.generateCode(4)
        this.emailSender.setVariables( { firstname: result.Value.Name, secretcode: code } )
        this.emailSender.sendEmail( forgetDto.email, forgetDto.email )
        const answer = {
            date: new Date().getTime()
        }
        return Result.success(answer, 200)
    }
  
    get name(): string { return this.constructor.name }
}