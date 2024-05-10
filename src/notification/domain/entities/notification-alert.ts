import { Entity } from "src/common/Domain/domain-object/entity.interface"

export class NotificationAlert extends Entity<string> {

    private user_id: string
    private message: string
    private title: string
    
    get UserId() { return this.user_id }
    get Title() { return this.title }
    get Message() { return this.message }

    protected constructor ( id: string, userId: string, title: string, message: string ) {
        super( id )
        this.user_id = userId
        this.title = title
        this.message = message
        this.ensureValidState()
    }

    protected ensureValidState (): void {
        if ( !this.user_id ) throw new Error( "Noti_Alert must have a user" )
        if ( !this.title ) throw new Error( "Noti_Alert must have a title" )
        if ( !this.message ) throw new Error( "Noti_Alert must have a message" )
    }

    static create ( id: string, user_id: string, token: string, message: string ): NotificationAlert {
        return new NotificationAlert( id, user_id, token, message )
    }

}