import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCourseLevelException } from '../exceptions/invalid-course-level-exception'


export class CourseLevel implements IValueObject<CourseLevel>{
    
    private readonly level: number
    
    get Value(){ return this.level }

    protected constructor ( level: number ){
        if (level < 1 || level > 5)
            throw new InvalidCourseLevelException()
        this.level = level
    }

    equals ( valueObject: CourseLevel ): boolean
    {
        return this.level === valueObject.Value
    }

    static create (level: number){
        return new CourseLevel(level)
    }

}