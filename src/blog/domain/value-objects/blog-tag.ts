import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogTagException } from '../exceptions/invalid-blog-tag-exception'


export class BlogTag implements IValueObject<BlogTag>{
    
    private readonly tag: string
    
    get Value(){ return this.tag }

    protected constructor ( tag: string ){
        if (tag.length < 2 || tag.length > 20)
            throw new InvalidBlogTagException()
        this.tag = tag
    }

    equals ( valueObject: BlogTag ): boolean
    {
        return this.tag === valueObject.Value
    }

    static create (tag: string){
        return new BlogTag(tag)
    }

}