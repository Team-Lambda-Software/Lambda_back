import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidTrainerEmailException extends DomainException {
    constructor() { super("El correo ingresado no es válido. Revise el formato nuevamente") }
}