import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCourseDateException } from '../exceptions/invalid-course-date-exception'


export class CourseDate implements IValueObject<CourseDate>{
    
    private readonly date: Date
    
    get Value(){ return this.date }

    protected constructor ( date: Date ){

        if (date > new Date())
            throw new InvalidCourseDateException()
        this.date = date
    }

    equals ( valueObject: CourseDate ): boolean
    {
        return this.date === valueObject.Value
    }

    static create (date: Date){
        return new CourseDate(date)
    }

}