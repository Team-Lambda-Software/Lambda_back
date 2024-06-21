import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseNameException extends DomainException{
    constructor(){super("El nombre del curso tiene que tener entre 5 y 120 caracteres")}
}