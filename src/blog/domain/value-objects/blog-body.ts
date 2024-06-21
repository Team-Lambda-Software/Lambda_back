import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogBodyException } from '../exceptions/invalid-blog-body-exception'


export class BlogBody implements IValueObject<BlogBody>{
    
    private readonly body: string
    
    get Value(){ return this.body }

    protected constructor ( body: string ){
        if (body.length < 5)
            throw new InvalidBlogBodyException()
        this.body = body
    }

    equals ( valueObject: BlogBody ): boolean
    {
        return this.body === valueObject.Value
    }

    static create (body: string){
        return new BlogBody(body)
    }

}