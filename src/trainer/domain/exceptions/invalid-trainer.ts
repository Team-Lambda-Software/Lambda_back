import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidTrainerException extends DomainException {
    constructor() { super("El entrenador debe ser válido"); }
}