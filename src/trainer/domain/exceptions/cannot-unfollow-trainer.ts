import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class CannotUnfollowTrainerException extends DomainException {
    constructor() { super("El usuario no se encuentra siguiendo al entrenador. No puede desuscribirse nuevamente")}
}