import { Result } from "src/common/Application/result-handler/Result"
import { Categorie } from "src/categories/domain/categories"
import { Repository, DataSource } from 'typeorm'
import { ICategoriRepository } from "src/categories/domain/repositories/categorie-repository.interface"
import { OrmCategorie } from "../../entities/orm-entities/categorie.entity"
import { OrmCategorieMapper } from '../../mappers/orm-mappers/orm-categorie-mapper'

export class OrmCategorieRepository extends Repository<OrmCategorie> implements ICategoriRepository{

    private readonly ormCategorieMapper: OrmCategorieMapper

    constructor ( ormCategorieMapper: OrmCategorieMapper, dataSource: DataSource )
    {
        super( OrmCategorie, dataSource.createEntityManager() )
        this.ormCategorieMapper = ormCategorieMapper
    }

    
    async findCategorieById ( id: string ): Promise<Result<Categorie>>
    {
        {
            const categorie = await this.findOneBy( { id } )
            if ( categorie )
            {
                return Result.success<Categorie>( await this.ormCategorieMapper.fromPersistenceToDomain( categorie ), 200 )
            }
            return Result.fail<Categorie>( new Error( 'Categorie not found' ), 404, 'Categorie not found' )
        }
    }

    

}


