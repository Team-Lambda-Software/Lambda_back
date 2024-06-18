import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidSectionException extends DomainException{
    constructor(){super("La sección tiene que ser válida")}
}