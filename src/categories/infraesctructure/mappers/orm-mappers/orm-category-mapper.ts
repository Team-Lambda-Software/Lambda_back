import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Category } from "src/categories/domain/categories"
import { OrmCategory } from "../../entities/orm-entities/orm-category"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { CategoryName } from "src/categories/domain/value-objects/category-title"
import { CategoryIcon } from "src/categories/domain/value-objects/category-image"

export class OrmCategoryMapper implements IMapper<Category, OrmCategory>
{
    fromDomainToPersistence ( domain: Category): Promise<OrmCategory>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( persistence: OrmCategory ): Promise<Category>
    {
        const categorie: Category = Category.create( CategoryId.create(persistence.id), CategoryName.create(persistence.categoryName), CategoryIcon.create( persistence.icon.url))
        return categorie
    }
}