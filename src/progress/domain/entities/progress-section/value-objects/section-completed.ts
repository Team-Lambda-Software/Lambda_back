import { IValueObject } from "src/common/Domain/value-object/value-object.interface";

export class SectionCompletion implements IValueObject<SectionCompletion>
{
    private readonly isCompleted:boolean;

    get Value() { return this.isCompleted; }

    protected constructor (isCompleted: boolean)
    {
        this.isCompleted = isCompleted;
    }

    equals(valueObject: SectionCompletion): boolean {
        return (this.Value === valueObject.Value);
    }

    static create (isCompleted:boolean): SectionCompletion
    {
        return new SectionCompletion(isCompleted);
    }
}