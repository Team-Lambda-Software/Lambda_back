import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Categorie } from "src/categories/domain/categories"
import { OrmCategorie } from "../../entities/orm-entities/categorie.entity"

export class OrmCategorieMapper implements IMapper<Categorie, OrmCategorie>
{
    fromDomainToPersistence ( domain: Categorie ): Promise<OrmCategorie>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( persistence: OrmCategorie ): Promise<Categorie>
    {
        const categorie: Categorie = Categorie.create( persistence.id, persistence.categorieName, persistence.description)
        return categorie
    }
}