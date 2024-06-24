import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidTrainerNameException extends DomainException {
    constructor() { super("El entrenador debe tener primer nombre y dos apellidos")}
}