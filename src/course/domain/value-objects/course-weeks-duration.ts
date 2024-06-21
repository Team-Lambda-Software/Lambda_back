import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCourseWeeksDurationException } from '../exceptions/invalid-course-weeks-duration-exception'


export class CourseWeeksDuration implements IValueObject<CourseWeeksDuration>{
    
    private readonly weeksDuration: number
    
    get Value(){ return this.weeksDuration }

    protected constructor ( weeksDuration: number ){
        if (weeksDuration < 1 )
            throw new InvalidCourseWeeksDurationException()
        this.weeksDuration = weeksDuration
    }

    equals ( valueObject: CourseWeeksDuration ): boolean
    {
        return this.weeksDuration === valueObject.Value
    }

    static create (weeksDuration: number){
        return new CourseWeeksDuration(weeksDuration)
    }

}