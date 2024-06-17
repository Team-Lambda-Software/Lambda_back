import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogCommentDateException } from '../exceptions/invalid-blog-comment-date-exception'


export class BlogCommentDate implements IValueObject<BlogCommentDate>{
    
    private readonly date: Date
    
    get Value(){ return this.date }

    protected constructor ( date: Date ){
        if (date > new Date())
            throw new InvalidBlogCommentDateException()
        this.date = date
    }

    equals ( valueObject: BlogCommentDate ): boolean
    {
        return this.date === valueObject.Value
    }

    static create (date: Date){
        return new BlogCommentDate(date)
    }

}