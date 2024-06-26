import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class CannotFollowTrainerException extends DomainException {
    constructor() { super("El usuario ya se encuentra siguiendo al entrenador. No puede suscribirse nuevamente")}
}