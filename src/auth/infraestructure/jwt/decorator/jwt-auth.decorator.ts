import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export function JwtAuthGuard(){
    return applyDecorators( UseGuards( AuthGuard( ) ) )
}