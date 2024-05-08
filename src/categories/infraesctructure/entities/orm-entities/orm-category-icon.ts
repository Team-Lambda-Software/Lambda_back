import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm"
import { OrmCategory } from "./orm-category"



@Entity( { name: 'category_icon' } )
export class OrmCategoryIcon
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) url: string

    static create ( id: string, url: string ): OrmCategoryIcon
    {
        const video = new OrmCategoryIcon()
        video.id = id
        video.url = url
        return video
    }

}



