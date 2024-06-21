import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity( { name: 'notification_address' } )
export class OrmNotificationAddress {

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) token: string
    @Column( { type: "uuid" } ) user_id: string

    static create ( id: string, user_id: string, token: string ): OrmNotificationAddress {
        const address = new OrmNotificationAddress()
        address.id = id
        address.user_id = user_id
        address.token = token
        return address
    }

}