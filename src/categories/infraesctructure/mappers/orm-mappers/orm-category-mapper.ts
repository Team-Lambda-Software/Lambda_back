import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Category } from "src/categories/domain/categories"
import { OrmCategory } from "../../entities/orm-entities/orm-category"
import { CategorieIcon } from "src/categories/domain/entities/category-icon"

export class OrmCategoryMapper implements IMapper<Category, OrmCategory>
{
    fromDomainToPersistence ( domain: Category): Promise<OrmCategory>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( persistence: OrmCategory ): Promise<Category>
    {
        const categorie: Category = Category.create( persistence.id, persistence.categoryName, persistence.description, CategorieIcon.create( persistence.icon.id, persistence.icon.url))
        return categorie
    }
}