import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidBlogTitleException extends DomainException{
    constructor(){super("El titulo del blog tiene que tener entre 5 y 120 caracteres")}
}