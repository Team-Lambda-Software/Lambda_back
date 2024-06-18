import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseWeeksDurationException extends DomainException{
    constructor(){super("La duracion en semanas del curso tiene que ser valida")}
}