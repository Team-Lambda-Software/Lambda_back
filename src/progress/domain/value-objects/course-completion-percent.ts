import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidCourseCompletionPercentException } from "../exceptions/invalid-course-completion-percent-exception";

export class CourseCompletionPercent implements IValueObject<CourseCompletionPercent>
{
    private readonly completion:number;

    get Value() { return this.completion; }

    protected constructor (completion: number)
    {
        if ((completion < 0) || (completion > 100))
        {
            throw new InvalidCourseCompletionPercentException();
        }
        this.completion = completion;
    }

    static create (completion:number):CourseCompletionPercent
    {
        return new CourseCompletionPercent(completion);
    }

    equals(valueObject: CourseCompletionPercent): boolean {
        return (this.Value === valueObject.Value);
    }
}