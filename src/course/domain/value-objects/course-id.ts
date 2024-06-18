import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCourseIdException } from '../exceptions/invalid-course-id-exception'


export class CourseId implements IValueObject<CourseId>{
    
    private readonly id: string
    
    get Value(){ return this.id }

    protected constructor ( id: string ){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        if (!regex.test(id))
            throw new InvalidCourseIdException()
        this.id = id
    }

    equals ( valueObject: CourseId ): boolean
    {
        return this.id === valueObject.Value
    }

    static create (id: string){
        return new CourseId(id)
    }

}