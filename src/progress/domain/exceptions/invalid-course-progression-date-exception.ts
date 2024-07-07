import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidCourseProgressionDateException extends DomainException {
    constructor() { super("La fecha de última visualización de un curso no puede ser posterior a la fecha actual") }
}