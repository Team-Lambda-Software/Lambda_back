import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCourseMinutesDurationException extends DomainException{
    constructor(){super("La duración en minutos del curso tiene que ser válida")}
}