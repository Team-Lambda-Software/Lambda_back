import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidCourseSubscriptionIdException } from "../exceptions/invalid-course-subscription-id-exception";

export class CourseSubscriptionId implements IValueObject<CourseSubscriptionId>
{
    private readonly id: string;

    get Value() { return this.id; }

    equals(valueObject: CourseSubscriptionId): boolean {
        return (this.Value === valueObject.Value);
    }

    protected constructor(id:string)
    {
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidCourseSubscriptionIdException(); }
        this.id = id;
    }

    static create (id:string):CourseSubscriptionId
    {
        return new CourseSubscriptionId(id);
    }
}