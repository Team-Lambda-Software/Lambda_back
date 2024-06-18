import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseDescriptionException extends DomainException{
    constructor(){super("La descripcion del curso tiene que tener mas de 5 caracteres")}
}