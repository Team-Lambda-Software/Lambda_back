import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidBlogCommentException extends DomainException{
    constructor(){super("El comentario tiene que ser válido")}
}