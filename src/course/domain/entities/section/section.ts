import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { SectionId } from "./value-objects/section-id"
import { SectionName } from "./value-objects/section-name"
import { SectionDescription } from "./value-objects/section-description"
import { SectionVideo } from "./value-objects/section-video"
import { SectionDuration } from "./value-objects/section-duration"
import { InvalidSectionException } from "./exceptions/invalid-section-exception"




export class Section extends Entity<SectionId>
{

    private name: SectionName
    private description: SectionDescription
    private duration: SectionDuration
    private video: SectionVideo
    
    protected constructor ( id: SectionId, name: SectionName, description: SectionDescription, duration: SectionDuration, video: SectionVideo)
    {
        super( id )
        this.name = name
        this.description = description
        this.video = video
        this.duration = duration
        this.ensureValidState()
    }

    get Name (): SectionName
    {
        return this.name
    }

    get Description (): SectionDescription
    {
        return this.description
    }

    get Video (): SectionVideo
    {
        return this.video
    }


    get Duration (): SectionDuration
    {
        return this.duration
    }

    protected ensureValidState (): void
    {
        if ( !this.name || !this.description || !this.video || !this.duration)
            throw new InvalidSectionException()

    }

    static create ( id: SectionId, name: SectionName, description: SectionDescription, duration: SectionDuration, video: SectionVideo): Section
    {
        return new Section( id, name, description,duration ,video)
    }



}