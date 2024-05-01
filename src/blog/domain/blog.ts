import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { BlogImage } from "./entities/blog-image"




export class Blog extends Entity<string>{

    private title: string
    private body: string
    private image: BlogImage
    private publicationDate: Date
    private trainerId: string
    private categoryId: string

    constructor ( id: string, title: string, body: string, image: BlogImage, publicationDate: Date, trainerId: string, categoryId: string )
    {
        super( id )
        this.title = title
        this.body = body
        this.image = image
        this.publicationDate = publicationDate
        this.trainerId = trainerId
        this.categoryId = categoryId
        this.validateState()
    }

    protected validateState (): void
    {
        if ( !this.title )
        {
            throw new Error( 'Title is required' )
        }
        if ( !this.body )
        {
            throw new Error( 'Body is required' )
        }
        if ( !this.image )
        {
            throw new Error( 'Image is required' )
        }
        if ( !this.publicationDate )
        {
            throw new Error( 'Publication date is required' )
        }
        if ( !this.trainerId )
        {
            throw new Error( 'Trainer id is required' )
        }
        if ( !this.categoryId )
        {
            throw new Error( 'Category id is required' )
        }
    }

    get Title (): string
    {
        return this.title
    }

    get Body (): string
    {
        return this.body
    }

    get Image (): BlogImage
    {
        return this.image
    }

    get PublicationDate (): Date
    {
        return this.publicationDate
    }

    get TrainerId (): string
    {
        return this.trainerId
    }

    get CategoryId (): string
    {
        return this.categoryId
    }

    static create ( id: string, title: string, body: string, image: BlogImage, publicationDate: Date, trainerId: string, categoryId: string ): Blog
    {
        return new Blog( id, title, body, image, publicationDate, trainerId, categoryId )
    }

}