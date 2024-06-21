import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCourseDescriptionException } from '../exceptions/invalid-course-description-exception'


export class CourseDescription implements IValueObject<CourseDescription>{
    
    private readonly description: string
    
    get Value(){ return this.description }

    protected constructor ( description: string ){
        if (description.length < 5)
            throw new InvalidCourseDescriptionException()
        this.description = description
    }

    equals ( valueObject: CourseDescription ): boolean
    {
        return this.description === valueObject.Value
    }

    static create (description: string){
        return new CourseDescription(description)
    }

}