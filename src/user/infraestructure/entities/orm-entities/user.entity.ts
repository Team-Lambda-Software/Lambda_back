import { Column, Entity, PrimaryColumn } from "typeorm"



@Entity()
export class OrmUser
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar', { unique: true } ) email: string
    @Column( 'varchar' ) password: string
    @Column( 'varchar' ) first_name: string
    @Column( 'varchar' ) first_last_name: string
    @Column( 'varchar' ) second_last_name: string

    //TODO all relations and fields for the stadistics, courses made, etc.

    static create ( id: string,
        email: string,
        password: string,
        first_name: string,
        first_last_name: string,
        second_last_name: string ): OrmUser
    {
        const user = new OrmUser()
        user.id = id
        user.email = email
        user.password = password
        user.first_name = first_name
        user.first_last_name = first_last_name
        user.second_last_name = second_last_name
        return user
    }


}