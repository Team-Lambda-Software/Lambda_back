import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseLevelException extends DomainException{
    constructor(){super("El nivel del curso tiene que estar entre 1 y 5")}
}