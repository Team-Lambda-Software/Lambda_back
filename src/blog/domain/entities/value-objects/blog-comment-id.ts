import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogCommentIdException } from '../exceptions/invalid-blog-comment-id-exception'


export class BlogCommentId implements IValueObject<BlogCommentId>{
    
    private readonly id: string
    
    get Value(){ return this.id }

    protected constructor ( id: string ){
        if (id.length < 5)
            throw new InvalidBlogCommentIdException()
        this.id = id
    }

    equals ( valueObject: BlogCommentId ): boolean
    {
        return this.id === valueObject.Value
    }

    static create (id: string){
        return new BlogCommentId(id)
    }

}