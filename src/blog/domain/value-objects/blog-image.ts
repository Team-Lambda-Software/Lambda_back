import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogImageException } from '../exceptions/invalid-blog-image-exception'


export class BlogImage implements IValueObject<BlogImage>{
    
    private readonly url: string
    
    get Value(){ return this.url }

    protected constructor ( url: string ){
        const regex = new RegExp('(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?')
        if (url.length < 5 || regex.test(url))
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