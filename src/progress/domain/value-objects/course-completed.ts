import { IValueObject } from "src/common/Domain/value-object/value-object.interface";

export class CourseCompleted implements IValueObject<CourseCompleted>
{
    private readonly isCompleted: boolean;

    get Value() { return this.isCompleted; }

    protected constructor (isCompleted:boolean)
    {
        this.isCompleted = isCompleted;
    }

    static create (isCompleted:boolean):CourseCompleted
    {
        return new CourseCompleted(isCompleted);
    }

    equals(valueObject: CourseCompleted): boolean {
        return (this.Value === valueObject.Value);
    }
}