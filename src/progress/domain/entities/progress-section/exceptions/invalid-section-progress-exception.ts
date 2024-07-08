import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidSectionProgressException extends DomainException
{
    constructor() { super("El progreso de sección debe ser válido"); }
}