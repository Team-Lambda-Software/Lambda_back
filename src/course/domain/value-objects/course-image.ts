import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCourseImageException } from '../exceptions/invalid-course-image-exception'


export class CourseImage implements IValueObject<CourseImage>{
    
    private readonly url: string
    
    get Value(){ return this.url }

    protected constructor ( url: string ){
        
        if (url.length < 5)
            throw new InvalidCourseImageException()
        this.url = url
    }

    equals ( valueObject: CourseImage ): boolean
    {
        return this.url === valueObject.Value
    }

    static create (url: string){
        return new CourseImage(url)
    }

}