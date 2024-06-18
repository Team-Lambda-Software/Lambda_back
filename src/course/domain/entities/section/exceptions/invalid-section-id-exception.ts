import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidSectionIdException extends DomainException{
    constructor(){super("El id de la sección tiene que ser un UUID válido")}
}