import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { SectionVideo } from "./compose-fields/section-video"
import { SectionImage } from "./compose-fields/section-image"



export class Section extends Entity<string>
{

    private name: string
    private description: string
    private videos?: SectionVideo[]
    private images?: SectionImage[]
    private paragraph?: string

    protected constructor ( id: string, name: string, description: string, videos?: SectionVideo[], images?: SectionImage[], paragraph?: string)
    {
        super( id )
        this.name = name
        this.description = description
        this.videos = videos
        this.images = images
        this.paragraph = paragraph
        this.ensureValidState()
    }

    get Name (): string
    {
        return this.name
    }

    get Description (): string
    {
        return this.description
    }

    get Videos (): SectionVideo[]
    {
        return this.videos
    }

    get Images (): SectionImage[]
    {
        return this.images
    }

    get Paragraph (): string
    {
        return this.paragraph
    }

    protected ensureValidState (): void
    {
        if ( !this.name )
            throw new Error( "Section must have a name" )

    }

    static create ( id: string, name: string, description: string, videos?: SectionVideo[], images?: SectionImage[], paragraph?: string ): Section
    {
        return new Section( id, name, description, videos, images, paragraph )
    }



}