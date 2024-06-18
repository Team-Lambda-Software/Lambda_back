import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCourseMinutesDurationException } from '../exceptions/invalid-course-minutes-duration-exception'


export class CourseMinutesDuration implements IValueObject<CourseMinutesDuration>{
    
    private readonly minutesDuration: number
    
    get Value(){ return this.minutesDuration }

    protected constructor ( minutesDuration: number ){
        if (minutesDuration < 1 )
            throw new InvalidCourseMinutesDurationException()
        this.minutesDuration = minutesDuration
    }

    equals ( valueObject: CourseMinutesDuration ): boolean
    {
        return this.minutesDuration === valueObject.Value
    }

    static create (minutesDuration: number){
        return new CourseMinutesDuration(minutesDuration)
    }

}