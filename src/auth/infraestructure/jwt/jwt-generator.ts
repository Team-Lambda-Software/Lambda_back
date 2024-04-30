import { JwtService } from "@nestjs/jwt";
import { IJwtGenerator } from "src/auth/application/interface/jwt-generator.interface";

export class JwtGenerator implements IJwtGenerator<string> {
    private readonly jwtService: JwtService
    
    constructor() { 
        this.jwtService = new JwtService()
    }
    
    generateJwt(param: string): string {
        return this.jwtService.sign(param)
    }
}