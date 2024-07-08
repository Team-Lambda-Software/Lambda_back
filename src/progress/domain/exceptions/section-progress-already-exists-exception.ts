import { DomainException } from "src/common/Domain/domain-exception/domain-exception";

export class SectionProgressAlreadyExistsException extends DomainException
{
    constructor() { super("Ya existe progreso asociado a esta sección. No puede ser creado nuevamente. Intente actualizarlo en caso de desear guardar algún avance"); }
}