import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseException extends DomainException{
    constructor(){super("El curso tiene que ser válido")}
}