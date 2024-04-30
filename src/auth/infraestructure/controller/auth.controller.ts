
import { Controller, Post } from "@nestjs/common"
import { LogInEntryInfrastructureDto } from "../dto/log-in-entry.infrastructure.dto";
import { SignUpEntryInfrastructureDto } from "../dto/sign-up-entry.infrastructure.dto";

@Controller('auth')
export class AuthController {

    constructor() {}

    @Post('login')
    async logIn(data: LogInEntryInfrastructureDto) {

    }
    
    @Post('signup')
    async signUp(data: SignUpEntryInfrastructureDto) {

    }

}

