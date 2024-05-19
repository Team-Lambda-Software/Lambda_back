import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { SectionVideo } from "./compose-fields/section-video"
import { SectionImage } from "./compose-fields/section-image"



export class Section extends Entity<string>
{

    private name: string
    private description: string
    private duration: number
    private video?: SectionVideo
    private image?: SectionImage
    private paragraph?: string

    protected constructor ( id: string, name: string, description: string, duration: number, video?: SectionVideo, image?: SectionImage, paragraph?: string)
    {
        super( id )
        this.name = name
        this.description = description
        this.video = video
        this.image = image
        this.paragraph = paragraph
        this.duration = duration
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

    get Video (): SectionVideo
    {
        return this.video
    }

    get Image (): SectionImage
    {
        return this.image
    }

    get Paragraph (): string
    {
        return this.paragraph
    }

    get Duration (): number
    {
        return this.duration
    }

    protected ensureValidState (): void
    {
        if ( !this.name )
            throw new Error( "Section must have a name" )



        if (( !this.video && !this.image && !this.paragraph ) || 
        ( this.video && (this.image || this.paragraph) ) || 
        ( this.image && (this.video || this.paragraph) ) || 
        ( this.paragraph && (this.image || this.video) ))
            throw new Error( "Section must have a video, image or paragraph" )

    }

    static create ( id: string, name: string, description: string, duration: number, video?: SectionVideo, image?: SectionImage, paragraph?: string ): Section
    {
        return new Section( id, name, description,duration ,video, image, paragraph )
    }



}