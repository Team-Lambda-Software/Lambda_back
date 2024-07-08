import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidCourseSubscriptionException extends DomainException
{
    constructor() { super("La suscripción o progreso del curso no es válida"); }
}