import { Column, Entity, PrimaryColumn } from "typeorm"



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



