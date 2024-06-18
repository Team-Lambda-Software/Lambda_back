import { AggregateRoot } from "src/common/Domain/aggregate-root/aggregate-root"
import { CategoryId } from "./value-objects/category-id"
import { CategoryName } from "./value-objects/category-title"
import { CategoryIcon } from "./value-objects/category-image"
import { CategoryCreated } from "./events/category-created-event"
import { InvalidCategoryException } from "./exceptions/invalid-category-exception"
import { DomainEvent } from "src/common/Domain/domain-event/domain-event"

export class Category extends AggregateRoot<CategoryId>{

    private name: CategoryName
    private icon: CategoryIcon

    
    get Name (): CategoryName
    {
        return this.name
    }

    get Icon (): CategoryIcon
    {
       return this.icon
    }

    protected constructor ( id: CategoryId, name: CategoryName, icon: CategoryIcon)
    {
        const categoryCreated: CategoryCreated = CategoryCreated.create(id, name, icon)
        super (id, categoryCreated)  
    }

    protected applyEvent ( event: DomainEvent ): void
    {
        switch (event.eventName){
            case 'CategoryCreated':
                const categoryCreated: CategoryCreated = event as CategoryCreated
                this.icon = categoryCreated.icon
                this.name = categoryCreated.name
        }
    }

    protected ensureValidState (): void{
        if ( !this.name || !this.icon)
            throw new InvalidCategoryException()

    
    }

    static create ( id: CategoryId, name: CategoryName, icon: CategoryIcon): Category 
    {
        return new Category(id, name, icon)
    }

}