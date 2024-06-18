import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCourseNameException } from '../exceptions/invalid-course-name-exception'


export class CourseName implements IValueObject<CourseName>{
    
    private readonly name: string
    
    get Value(){ return this.name }

    protected constructor ( name: string ){
        if (name.length < 5 || name.length > 120)
            throw new InvalidCourseNameException()
        this.name = name
    }

    equals ( valueObject: CourseName ): boolean
    {
        return this.name === valueObject.Value
    }

    static create (name: string){
        return new CourseName(name)
    }

}