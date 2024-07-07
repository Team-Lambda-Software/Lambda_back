import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidSectionProgressIdException } from "../exceptions/invalid-section-progress-id";

export class SectionProgressId implements IValueObject<SectionProgressId> {
    private readonly id:string;

    get Value(){ return this.id; }

    protected constructor (id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidSectionProgressIdException() }
        this.id = id;
    }

    equals(valueObject: SectionProgressId): boolean {
        return (this.Value === valueObject.Value);
    }

    static create (id:string) {
        return new SectionProgressId(id);
    }
}