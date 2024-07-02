import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidCourseProgressionDateException } from "../exceptions/invalid-course-progression-date-exception";

export class CourseProgressionDate implements IValueObject<CourseProgressionDate>
{
    private readonly lastProgression:Date;

    get Value() { return this.lastProgression; }

    protected constructor(lastProgression: Date)
    {
        if (Date.now() < lastProgression.getTime())
        {
            throw new InvalidCourseProgressionDateException();
        }
        this.lastProgression = lastProgression;
    }

    static create (lastProgression: Date):CourseProgressionDate
    {
        return new CourseProgressionDate(lastProgression);
    }

    equals(valueObject: CourseProgressionDate): boolean {
        return (this.Value === valueObject.Value);
    }
}