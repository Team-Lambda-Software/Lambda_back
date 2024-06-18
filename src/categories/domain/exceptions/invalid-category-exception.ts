import { DomainException } from "src/common/Domain/domain-exception/domain-exception"



export class InvalidCategoryException extends DomainException{
    constructor(){super("La categoria tiene que ser válida")}
}