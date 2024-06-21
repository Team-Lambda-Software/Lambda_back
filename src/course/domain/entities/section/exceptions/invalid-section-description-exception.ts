import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidSectionDescriptionException extends DomainException{
    constructor(){super("La descripción de la sección tiene que ser válida")}
}