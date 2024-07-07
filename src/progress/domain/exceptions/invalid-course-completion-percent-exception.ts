import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidCourseCompletionPercentException extends DomainException
{
    constructor() { super("El porcentaje de completación debe ser un número entre 0% y 100%"); }
}