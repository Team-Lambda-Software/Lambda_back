import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity( { name: 'notification_address' } )
export class OrmNotificationAddress {

    @PrimaryColumn( 'varchar' ) token: string
    @Column( { type: "uuid" } ) user_id: string

    static create ( user_id: string, token: string ): OrmNotificationAddress {
        const address = new OrmNotificationAddress()
        address.user_id = user_id
        address.token = token
        return address
    }

}