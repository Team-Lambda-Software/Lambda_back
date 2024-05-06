import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { BlogImage } from "./entities/blog-image"
import { Trainer } from "src/trainer/domain/trainer"




export class Blog extends Entity<string>{

    private title: string
    private body: string
    private image: BlogImage
    private publicationDate: Date
    private trainer: Trainer
    private categoryId: string

    protected constructor ( id: string, title: string, body: string, image: BlogImage, publicationDate: Date, trainer: Trainer, categoryId: string )
    {
        super( id )
        this.title = title
        this.body = body
        this.image = image
        this.publicationDate = publicationDate
        this.trainer = trainer
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
        if ( !this.trainer )
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

    get Trainer (): Trainer
    {
        return this.trainer
    }

    get CategoryId (): string
    {
        return this.categoryId
    }

    static create ( id: string, title: string, body: string, image: BlogImage, publicationDate: Date, trainer: Trainer, categoryId: string ): Blog
    {
        return new Blog( id, title, body, image, publicationDate, trainer, categoryId )
    }

}