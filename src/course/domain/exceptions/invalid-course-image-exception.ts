import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseImageException extends DomainException{
    constructor(){super("La imagen del curso tiene que ser un url valido")}
}