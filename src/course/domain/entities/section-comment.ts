import { Entity } from "src/common/Domain/domain-object/entity.interface"




export class SectionComment extends Entity<string>
{

    private userId: string
    private text: string
    private date: Date
    private sectionId: string

    get UserId ()
    {
        return this.userId
    }

    get Text ()
    {
        return this.text
    }

    get Date ()
    {
        return this.date
    }

    get SectionId ()
    {
        return this.sectionId
    }

    protected constructor ( id: string, userId: string, text: string, date: Date, sectionId: string )
    {
        super( id )
        this.userId = userId
        this.text = text
        this.date = date
        this.sectionId = sectionId
        this.ensureValidState()
    }

    protected ensureValidState (): void
    {
        if ( !this.userId )
            throw new Error( "Comment must have a user" )

        if ( !this.text )
            throw new Error( "Comment must have a text" )

        if ( !this.date )
            throw new Error( "Comment must have a valid date" )

    }

    static create ( id: string, userId: string, text: string, date: Date, sectionId: string ): SectionComment
    {
        return new SectionComment( id, userId, text, date, sectionId)
    }

}