import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { CategorieIcon } from "./entities/category-icon"

export class Category extends Entity<string>{

    private categorieName: string
    private description: string
    private icon: CategorieIcon

    
    get CategorieName (): string
    {
        return this.categorieName
    }

    get Description (): string
    {
        return this.description
    }

    get Icon (): CategorieIcon
    {
       return this.icon
    }

    protected constructor ( id: string, categorieName: string, description: string, icon: CategorieIcon)
    {
        super (id)
        this.categorieName = categorieName
        this.description = description
        this.icon = icon
        this.ValidState()
    }

    protected ValidState (): void{
        if ( !this.categorieName )
            throw new Error( "Categorie must have a name" )

        if ( !this.description )
            throw new Error( "Categorie must have a description" )
        if ( !this.icon)
           throw new Error( 'Categorie must have an icon')
    
    }

    static create ( id: string, categorieName: string, description: string, icon: CategorieIcon): Category 
    {
        return new Category(id, categorieName, description, icon)
    }

}