import { Column, Entity, PrimaryColumn } from "typeorm"



@Entity()
export class OrmCategorie
{

    @PrimaryColumn( { type: "uuid" } ) id: string
    @Column( 'varchar' ) categorieName: string
    @Column( 'varchar' ) description: string


    static create ( id: string, categorieName: string, description: string)
    {
        const categorie = new OrmCategorie()
        categorie.id = id
        categorie.categorieName = categorieName
        categorie.description = description
        return categorie
    }


}