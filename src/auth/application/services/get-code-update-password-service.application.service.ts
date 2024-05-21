import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { GetCodeUpdatePasswordEntryApplicationDto } from "../dto/get-code-update-password-entry.application";
import { ICodeGenerator } from "../interface/code-generator.interface";
import { IEmailSender } from "src/common/Application/email-sender/email-sender.interface.application";

export class GetCodeUpdatePasswordUserApplicationService implements IApplicationService<GetCodeUpdatePasswordEntryApplicationDto, any> {
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
    
    async execute(updateDto: GetCodeUpdatePasswordEntryApplicationDto): Promise<Result<any>> {
        const result = await this.userRepository.findUserByEmail( updateDto.email )
        if ( !result.isSuccess() ) 
            return Result.fail( new Error('Cuenta no existente'), 500, 'Cuenta no existente' )
        const code = this.codeGenerator.generateCode(4)
        this.emailSender.setVariables( { firstname: result.Value.FirstName, secretcode: code } )
        this.emailSender.sendEmail( updateDto.email, updateDto.email )
        const answer = {
            email: updateDto.email,
            code: code,
            date: new Date().getTime()
        }
        return Result.success(answer, 200)
    }
  
    get name(): string { return this.constructor.name }
}