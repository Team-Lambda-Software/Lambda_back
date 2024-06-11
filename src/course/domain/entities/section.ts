import { Entity } from "src/common/Domain/domain-object/entity.interface"




export class Section extends Entity<string>
{

    private name: string
    private description: string
    private duration: number
    private video: string
    
    protected constructor ( id: string, name: string, description: string, duration: number, video?: string)
    {
        super( id )
        this.name = name
        this.description = description
        this.video = video
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

    get Video (): string
    {
        return this.video
    }


    get Duration (): number
    {
        return this.duration
    }

    protected ensureValidState (): void
    {
        if ( !this.name )
            throw new Error( "Section must have a name" )



        if (!this.video)
            throw new Error( "Section must have a video" )

    }

    static create ( id: string, name: string, description: string, duration: number, video: string): Section
    {
        return new Section( id, name, description,duration ,video)
    }



}