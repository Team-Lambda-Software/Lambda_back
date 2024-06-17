import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidBlogIdException extends DomainException{
    constructor(){super("El id del blog tiene que ser un UUID válido")}
}