import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidSectionCommentTextException extends DomainException{
    constructor(){super("El texto del comentario tiene que ser válido")}
}