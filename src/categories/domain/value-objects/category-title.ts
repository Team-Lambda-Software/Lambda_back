import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCategoryNameException } from '../exceptions/invalid-category-name-exception'


export class CategoryName implements IValueObject<CategoryName>{
    
    private readonly name: string
    
    get Value(){ return this.name }

    protected constructor ( name: string ){
        if (name.length < 5 || name.length > 120)
            throw new InvalidCategoryNameException()
        this.name = name
    }

    equals ( valueObject: CategoryName ): boolean
    {
        return this.name === valueObject.Value
    }

    static create (name: string){
        return new CategoryName(name)
    }

}