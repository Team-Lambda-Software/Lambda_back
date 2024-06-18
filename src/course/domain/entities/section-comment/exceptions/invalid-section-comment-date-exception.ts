import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidSectionCommentDateException extends DomainException{
    constructor(){super("La fecha del comentario tiene que ser válido")}
}