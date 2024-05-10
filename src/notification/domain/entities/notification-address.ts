import { Entity } from "src/common/Domain/domain-object/entity.interface"

export class NotificationAddress extends Entity<string> {

    private user_id: string
    private token: string
    
    get UserId () { return this.user_id }
    get Token () { return this.token }

    protected constructor ( id: string, userId: string, token: string ) {
        super( id )
        this.user_id = userId
        this.token = token
        this.ensureValidState()
    }

    protected ensureValidState (): void {
        if ( !this.user_id ) throw new Error( "Not_Address must have a user" )
        if ( !this.token ) throw new Error( "Not_Address must have a token" )
    }

    static create ( id: string, user_id: string, token: string ): NotificationAddress {
        return new NotificationAddress( id, user_id, token )
    }

}