import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity( { name: 'notification_alert' } )
export class OrmNotificationAlert {

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( { type: "uuid" } ) user_id: string
    @Column( 'varchar' ) title: string
    @Column( 'varchar' ) body: string
    @Column( 'boolean' ) userReaded: boolean
    @Column( 'date' ) date: Date

    static create ( id: string, user_id: string, title: string, body: string, userReaded: boolean, date: Date ): OrmNotificationAlert {
        const address = new OrmNotificationAlert()
        address.id = id
        address.user_id = user_id
        address.title = title
        address.body = body
        address.userReaded = userReaded
        address.date = date
        return address
    }

}