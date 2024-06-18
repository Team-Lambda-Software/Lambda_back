import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidSectionNameException extends DomainException{
    constructor(){super("El nombre de la sección tiene que tener entre 5 y 120 caracteres")}
}