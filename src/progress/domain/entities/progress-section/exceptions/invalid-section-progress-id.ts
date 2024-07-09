import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidSectionProgressIdException extends DomainException {
    constructor() { super("El id del progreso de la sección debe ser un UUIDv4 válido") }
}