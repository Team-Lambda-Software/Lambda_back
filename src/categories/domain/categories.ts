import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { CategorieImage } from "./entities/categorie-image"

export class Categorie extends Entity<string>{

    private categorieName: string
    private description: string
    private image: CategorieImage

    
    get CategorieName (): string
    {
        return this.categorieName
    }

    get Description (): string
    {
        return this.description
    }

    get Image (): CategorieImage
    {
        return this.image
    }

    protected constructor ( id: string, categorieName: string, description: string, image: CategorieImage)
    {
        super (id)
        this.categorieName = categorieName
        this.description = description
        this.categorieValidState()
    }

    protected categorieValidState (): void{
        if ( !this.categorieName )
            throw new Error( "Categorie must have a name" )

        if ( !this.description )
            throw new Error( "Categorie must have a description" )
        if ( !this.image)
            throw new Error( 'Categorie mush have a image')
    
    }

    static create ( id: string, categorieName: string, description: string, image: CategorieImage): Categorie 
    {
        return new Categorie(id, categorieName, description, image)
    }

}