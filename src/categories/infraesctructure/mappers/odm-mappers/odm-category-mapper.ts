import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Category } from "src/categories/domain/categories"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { CategoryName } from "src/categories/domain/value-objects/category-title"
import { CategoryIcon } from "src/categories/domain/value-objects/category-image"
import { OdmCategoryEntity } from "../../entities/odm-entities/odm-category.entity"
import { Model } from "mongoose"

export class OdmCategoryMapper implements IMapper<Category, OdmCategoryEntity>
{
    private readonly categoryModel: Model<OdmCategoryEntity>
    constructor ( categoryModel: Model<OdmCategoryEntity> )
    {
        this.categoryModel = categoryModel
    }
    async fromDomainToPersistence ( domain: Category): Promise<OdmCategoryEntity>
    {
        const category = new this.categoryModel({
            id: domain.Id.Value,
            categoryName: domain.Name.Value,
            icon: domain.Icon.Value
        })
        return category
    }
    async fromPersistenceToDomain ( persistence: OdmCategoryEntity ): Promise<Category>
    {
        const categorie: Category = Category.create( CategoryId.create(persistence.id), CategoryName.create(persistence.categoryName), CategoryIcon.create( persistence.icon))
        return categorie
    }
}