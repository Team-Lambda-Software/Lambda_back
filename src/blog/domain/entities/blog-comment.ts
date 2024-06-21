import { Entity } from "src/common/Domain/domain-object/entity.interface"




export class BlogComment extends Entity<string>
{

    private userId: string
    private text: string
    private date: Date
    private blogId: string

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

    get BlogId ()
    {
        return this.blogId
    }

    protected constructor ( id: string, userId: string, text: string, date: Date, blogId: string )
    {
        super( id )
        this.userId = userId
        this.text = text
        this.date = date
        this.blogId = blogId
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

    static create ( id: string, userId: string, text: string, date: Date, blogId: string ): BlogComment
    {
        return new BlogComment( id, userId, text, date, blogId)
    }

}