import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidSectionDurationException extends DomainException{
    constructor(){super("La duración de la sección tiene que ser válida")}
}