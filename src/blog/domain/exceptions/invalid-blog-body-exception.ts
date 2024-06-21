import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidBlogBodyException extends DomainException{
    constructor(){super("El Body del blog tiene que tener mas de 5 caracteres")}
}