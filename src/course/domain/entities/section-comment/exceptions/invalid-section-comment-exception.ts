import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidSectionCommentException extends DomainException{
    constructor(){super("El comentario tiene que ser válido")}
}