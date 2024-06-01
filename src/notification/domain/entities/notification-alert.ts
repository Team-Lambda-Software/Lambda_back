import { Entity } from "src/common/Domain/domain-object/entity.interface"

export class NotificationAlert extends Entity<string> {

    private user_id: string
    private body: string
    private title: string
    private userReaded: boolean
    private date: Date
    
    get UserId() { return this.user_id }
    get Title() { return this.title }
    get Body() { return this.body }
    get Date() { return this.date }
    get UserReaded() { return this.userReaded }

    protected constructor ( id: string, userId: string, title: string, body: string, userReaded: boolean, date: Date ) {
        super( id )
        this.user_id = userId
        this.title = title
        this.body = body
        this.userReaded = userReaded
        this.date = date
        this.ensureValidState()
    }

    protected ensureValidState (): void {
        if ( !this.user_id ) throw new Error( "Noti_Alert must have a user" )
        if ( !this.title ) throw new Error( "Noti_Alert must have a title" )
        if ( !this.body ) throw new Error( "Noti_Alert must have a message" )
        if ( !this.date ) throw new Error( "Noti_Alert must have a date" )
    }

    static create ( id: string, user_id: string, title: string, body: string, userReaded: boolean, date: Date ): NotificationAlert {
        return new NotificationAlert( id, user_id, title, body, userReaded, date )
    }

}