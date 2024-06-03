import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity( { name: 'notification_alert' } )
export class OrmNotificationAlert {

    @Column( 'varchar', { default: 'CLIENT' } ) type: string
    
    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( { type: "uuid" } ) user_id: string
    @Column( 'varchar', { default: 'title-default' } ) title: string
    @Column( 'varchar', { default: 'body-default' } ) body: string
    @Column( 'boolean', { default: true } ) userReaded: boolean
    @Column( 'date', { default: '2019-01-01' } ) date: Date

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