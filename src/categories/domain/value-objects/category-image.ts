import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidCategoryIconException } from '../exceptions/invalid-category-icon-exception'


export class CategoryIcon implements IValueObject<CategoryIcon>{
    
    private readonly url: string
    
    get Value(){ return this.url }

    protected constructor ( url: string ){
        
        if (url.length < 5)
            throw new InvalidCategoryIconException()
        this.url = url
    }

    equals ( valueObject: CategoryIcon ): boolean
    {
        return this.url === valueObject.Value
    }

    static create (url: string){
        return new CategoryIcon(url)
    }

}