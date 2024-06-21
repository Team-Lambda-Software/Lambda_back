import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidBlogPublicationDateException } from '../exceptions/invalid-blog-publication-date-exception'


export class BlogPublicationDate implements IValueObject<BlogPublicationDate>{
    
    private readonly publicationDate: Date
    
    get Value(){ return this.publicationDate }

    protected constructor ( publicationDate: Date ){
        if (publicationDate > new Date())
            throw new InvalidBlogPublicationDateException()
        this.publicationDate = publicationDate
    }

    equals ( valueObject: BlogPublicationDate ): boolean
    {
        return this.publicationDate === valueObject.Value
    }

    static create (publicationDate: Date){
        return new BlogPublicationDate(publicationDate)
    }

}