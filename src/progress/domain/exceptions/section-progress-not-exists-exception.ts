import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class SectionProgressNotExistsException extends DomainException
{
    constructor() { super("No existe progreso asociado a la sección indicada"); }
}