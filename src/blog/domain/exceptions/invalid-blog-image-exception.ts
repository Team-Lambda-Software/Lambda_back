import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidBlogImageException extends DomainException{
    constructor(){super("La imagen del blog tiene que ser un url valido")}
}