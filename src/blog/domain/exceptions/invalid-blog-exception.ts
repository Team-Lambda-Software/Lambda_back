import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidBlogException extends DomainException{
    constructor(){super("El blog tiene que ser válido")}
}