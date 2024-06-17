import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidBlogCommentIdException extends DomainException{
    constructor(){super("El id del comentario tiene que ser un UUID válido")}
}