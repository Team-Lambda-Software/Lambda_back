import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseTagException extends DomainException{
    constructor(){super("El tag del curso tiene que ser válido")}
}