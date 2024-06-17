import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidBlogTagException extends DomainException{
    constructor(){super("El tag tiene que ser válido")}
}