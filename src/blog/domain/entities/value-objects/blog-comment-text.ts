import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogCommentTextException } from '../exceptions/invalid-blog-comment-text-exception'


export class BlogCommentText implements IValueObject<BlogCommentText>{
    
    private readonly text: string
    
    get Value(){ return this.text }

    protected constructor ( text: string ){
        if (text.length < 5)
            throw new InvalidBlogCommentTextException()
        this.text = text
    }

    equals ( valueObject: BlogCommentText ): boolean
    {
        return this.text === valueObject.Value
    }

    static create (text: string){
        return new BlogCommentText(text)
    }

}