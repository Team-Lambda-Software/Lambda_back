import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogImageException } from '../exceptions/invalid-blog-image-exception'


export class BlogImage implements IValueObject<BlogImage>{
    
    private readonly url: string
    
    get Value(){ return this.url }

    protected constructor ( url: string ){
        
        if (url.length < 5)
            throw new InvalidBlogImageException()
        this.url = url
    }

    equals ( valueObject: BlogImage ): boolean
    {
        return this.url === valueObject.Value
    }

    static create (url: string){
        return new BlogImage(url)
    }

}