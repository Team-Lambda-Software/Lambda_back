import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogIdException } from '../exceptions/invalid-blog-id-exception'


export class BlogId implements IValueObject<BlogId>{
    
    private readonly id: string
    
    get Value(){ return this.id }

    protected constructor ( id: string ){
        if (id.length < 5)
            throw new InvalidBlogIdException()
        this.id = id
    }

    equals ( valueObject: BlogId ): boolean
    {
        return this.id === valueObject.Value
    }

    static create (id: string){
        return new BlogId(id)
    }

}