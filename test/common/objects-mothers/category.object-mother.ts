import { Category } from "src/categories/domain/categories"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { CategoryIcon } from "src/categories/domain/value-objects/category-image"
import { CategoryName } from "src/categories/domain/value-objects/category-title"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"


export class CategoryObjectMother {
     
    static async createNormalCategory( name: string){
        const idGenerator = new UuidGenerator()

        const normalCategory = Category.create(
            CategoryId.create(await idGenerator.generateId()), 
            CategoryName.create(name),
            CategoryIcon.create('www.example.com')
        )
        
        return normalCategory;
    }
}