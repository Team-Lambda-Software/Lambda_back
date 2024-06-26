import { Model } from "mongoose"
import { Category } from "src/categories/domain/categories"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { CategoryIcon } from "src/categories/domain/value-objects/category-image"
import { CategoryName } from "src/categories/domain/value-objects/category-title"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"


export class CategoryObjectMother {
     
    private readonly categoryModel: Model<OdmCategoryEntity>
    constructor ( categoryModel: Model<OdmCategoryEntity> ){
        this.categoryModel = categoryModel
    }
    static async createNormalCategory( name: string){
        const idGenerator = new UuidGenerator()

        const normalCategory = Category.create(
            CategoryId.create(await idGenerator.generateId()), 
            CategoryName.create(name),
            CategoryIcon.create('www.example.com')
        )
        
        return normalCategory;
    }

    async createOdmCategory (){
        return new this.categoryModel({
            id: 'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7', 
            categoryName: 'example', 
            icon: 'www.example.com'})
    }

    
}