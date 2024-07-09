import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class InvalidSectionVideoProgressException extends DomainException {
    constructor() { super("El progreso (tiempo visualizado) del video de una sección debe ser positivo, y no puede ser mayor a la duración total del mismo"); }
}