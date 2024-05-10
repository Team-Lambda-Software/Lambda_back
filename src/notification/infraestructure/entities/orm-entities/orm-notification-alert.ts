import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity( { name: 'notification_alert' } )
export class OrmNotificationAlert {

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) title: string
    @Column( 'varchar' ) message: string
    @Column( { type: "uuid" } ) user_id: string

    static create ( id: string, user_id: string, title: string, message: string ): OrmNotificationAlert {
        const address = new OrmNotificationAlert()
        address.id = id
        address.user_id = user_id
        address.title = title
        address.message = message
        return address
    }

}