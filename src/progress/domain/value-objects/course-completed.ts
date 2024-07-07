import { IValueObject } from "src/common/Domain/value-object/value-object.interface";

export class CourseCompletion implements IValueObject<CourseCompletion>
{
    private readonly isCompleted: boolean;

    get Value() { return this.isCompleted; }

    protected constructor (isCompleted:boolean)
    {
        this.isCompleted = isCompleted;
    }

    static create (isCompleted:boolean):CourseCompletion
    {
        return new CourseCompletion(isCompleted);
    }

    equals(valueObject: CourseCompletion): boolean {
        return (this.Value === valueObject.Value);
    }
}