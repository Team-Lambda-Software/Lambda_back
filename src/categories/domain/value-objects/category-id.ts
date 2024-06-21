import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCategoryIdException } from '../exceptions/invalid-category-id-exception'


export class CategoryId implements IValueObject<CategoryId>{
    
    private readonly id: string
    
    get Value(){ return this.id }

    protected constructor ( id: string ){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        if (!regex.test(id))
            throw new InvalidCategoryIdException()
        this.id = id
    }

    equals ( valueObject: CategoryId ): boolean
    {
        return this.id === valueObject.Value
    }

    static create (id: string){
        return new CategoryId(id)
    }

}