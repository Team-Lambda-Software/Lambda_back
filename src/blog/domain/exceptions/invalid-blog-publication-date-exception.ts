import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidBlogPublicationDateException extends DomainException{
    constructor(){super("La fecha de publicación tiene que ser una fecha válida")}
}