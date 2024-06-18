import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidSectionVideoException extends DomainException{
    constructor(){super("El video de la sección tiene que ser un url valido")}
}