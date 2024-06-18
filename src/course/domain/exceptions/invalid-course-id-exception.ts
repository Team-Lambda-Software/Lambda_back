import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseIdException extends DomainException{
    constructor(){super("El id del curso tiene que ser un UUID válido")}
}