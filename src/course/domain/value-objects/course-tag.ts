import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCourseTagException } from '../exceptions/invalid-course-tag-exception'


export class CourseTag implements IValueObject<CourseTag>{
    
    private readonly tag: string
    
    get Value(){ return this.tag }

    protected constructor ( tag: string ){
        if (tag.length < 2 || tag.length > 20)
            throw new InvalidCourseTagException()
        this.tag = tag
    }

    equals ( valueObject: CourseTag ): boolean
    {
        return this.tag === valueObject.Value
    }

    static create (tag: string){
        return new CourseTag(tag)
    }

}