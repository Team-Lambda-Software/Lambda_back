import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { CategoryIcon } from "./entities/category-icon"

export class Category extends Entity<string>{

    private name: string
    private icon: CategoryIcon

    
    get Name (): string
    {
        return this.name
    }

    get Icon (): CategoryIcon
    {
       return this.icon
    }

    protected constructor ( id: string, name: string, icon: CategoryIcon)
    {
        super (id)
        this.name = name
        this.icon = icon
        this.ValidState()
    }

    protected ValidState (): void{
        if ( !this.name )
            throw new Error( "Categorie must have a name" )

        if ( !this.icon)
           throw new Error( 'Categorie must have an icon')
    
    }

    static create ( id: string, name: string, icon: CategoryIcon): Category 
    {
        return new Category(id, name, icon)
    }

}