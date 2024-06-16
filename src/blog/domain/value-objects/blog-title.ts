import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogTitleException } from '../exceptions/invalid-blog-title-exception'


export class BlogTitle implements IValueObject<BlogTitle>{
    
    private readonly title: string
    
    get Value(){ return this.title }

    protected constructor ( title: string ){
        if (title.length < 5 || title.length > 30)
            throw new InvalidBlogTitleException()
        this.title = title
    }

    equals ( valueObject: BlogTitle ): boolean
    {
        return this.title === valueObject.Value
    }

    static create (title: string){
        return new BlogTitle(title)
    }

}