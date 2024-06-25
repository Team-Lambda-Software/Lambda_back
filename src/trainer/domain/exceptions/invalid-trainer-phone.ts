import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidTrainerPhoneException extends DomainException {
    constructor() { super("Telefono inválido. Revise que sólo haya ingresado números, y tenga una operadora de telefonía móvil y sufijo correctos") }
}