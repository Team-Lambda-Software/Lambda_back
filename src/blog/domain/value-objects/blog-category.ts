import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { CategoryId } from 'src/categories/domain/value-objects/category-id'


export class BlogCategory implements IValueObject<BlogCategory>{
    
    private readonly id: CategoryId
    
    get Value(){ return this.id.Value }

    protected constructor ( id: CategoryId ){
        this.id = id
    }

    equals ( valueObject: BlogCategory ): boolean
    {
        return this.id.equals(valueObject.id)
    }

    static create (id: CategoryId){
        return new BlogCategory(id)
    }

}