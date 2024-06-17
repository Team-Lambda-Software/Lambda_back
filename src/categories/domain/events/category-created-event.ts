import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { CategoryName } from "../value-objects/category-title"
import { CategoryId } from "../value-objects/category-id"
import { CategoryIcon } from "../value-objects/category-image"


export class CategoryCreated extends DomainEvent{
    protected constructor ( 
        public id: CategoryId,
        public name: CategoryName,
        public icon: CategoryIcon)
    {
        super()
    }

    static create ( id: CategoryId, name: CategoryName, icon: CategoryIcon): CategoryCreated
    {
        return new CategoryCreated( id, name, icon)
    }
}