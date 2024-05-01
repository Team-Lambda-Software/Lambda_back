import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface";
import { GetCodeUpdatePasswordEntryApplicationDto } from "../dto/get-code-update-password-entry.application";
import { EmailSender } from "src/common/Application/email-sender/email-sender.application";
import { ICodeGenerator } from "../interface/code-generator.interface";

export class GetCodeUpdatePasswordUserApplicationService implements IApplicationService<GetCodeUpdatePasswordEntryApplicationDto, any> {
    private readonly userRepository: IUserRepository   
    private readonly emailSender: EmailSender;
    private readonly codeGenerator: ICodeGenerator<number[]>; 
    constructor(
        userRepository: IUserRepository,
        emailSender: EmailSender,
        codeGenerator: ICodeGenerator<number[]>,
    ){
        this.userRepository = userRepository
        this.emailSender = emailSender
        this.codeGenerator = codeGenerator
    }
    
    async execute(updateDto: GetCodeUpdatePasswordEntryApplicationDto): Promise<Result<any>> {
        const result = await this.userRepository.findUserByEmail( updateDto.email )
        if ( !result.isSuccess() ) {
            return Result.fail(
                new Error('Cuenta no existente'),
                500,
                'Cuenta no existente'
            )
        }
        const code = this.codeGenerator.generateCode(4)
        this.emailSender.sendEmail( updateDto.email, updateDto.email )
        return Result.success('Codigo es: ' + code, 200)
    }
   
    get name(): string { return this.constructor.name }
}