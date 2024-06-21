import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCategoryNameException extends DomainException{
    constructor(){super("El nombre de la categoría tiene que ser válido")}
}