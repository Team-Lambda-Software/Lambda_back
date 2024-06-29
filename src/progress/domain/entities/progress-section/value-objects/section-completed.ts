import { IValueObject } from "src/common/Domain/value-object/value-object.interface";

export class SectionCompleted implements IValueObject<SectionCompleted>
{
    private readonly isCompleted:boolean;

    get Value() { return this.isCompleted; }

    protected constructor (isCompleted: boolean)
    {
        this.isCompleted = isCompleted;
    }

    equals(valueObject: SectionCompleted): boolean {
        return (this.Value === valueObject.Value);
    }

    static create (isCompleted:boolean): SectionCompleted
    {
        return new SectionCompleted(isCompleted);
    }
}