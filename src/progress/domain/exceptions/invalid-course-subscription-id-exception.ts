import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidCourseSubscriptionIdException extends DomainException {
    constructor() { super("El id de la subscripción - o progreso - de un curso debe ser un UUIDv4 válido") }
}