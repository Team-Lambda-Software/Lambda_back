import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidTrainerIdException extends DomainException {
    constructor() { super("El id del entrenador debe ser un UUIDv4 válido") }
}