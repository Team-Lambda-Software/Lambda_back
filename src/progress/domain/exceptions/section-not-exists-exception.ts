import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class SectionNotExistsException extends DomainException
{
    constructor() { super("No existe ninguna sección asociada al id dado"); }
}