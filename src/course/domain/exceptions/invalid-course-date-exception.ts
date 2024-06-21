import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseDateException extends DomainException{
    constructor(){super("La fecha de publicación del curso tiene que ser una fecha válida")}
}