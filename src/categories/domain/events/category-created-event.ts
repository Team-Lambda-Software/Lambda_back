import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { CategoryName } from "../value-objects/category-title"
import { CategoryId } from "../value-objects/category-id"
import { CategoryIcon } from "../value-objects/category-image"


export class CategoryCreated extends DomainEvent{
    protected constructor ( 
        public id: string,
        public name: string,
        public icon: string)
    {
        super()
    }

    static create ( id: string, name: string, icon: string): CategoryCreated
    {
        return new CategoryCreated( id, name, icon)
    }
}