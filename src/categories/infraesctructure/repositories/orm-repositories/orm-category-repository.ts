import { Result } from "src/common/Application/result-handler/Result"
import { Category } from "src/categories/domain/categories"
import { Repository, DataSource } from 'typeorm'
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { OrmCategory } from "../../entities/orm-entities/orm-category"
import { OrmCategoryMapper } from '../../mappers/orm-mappers/orm-category-mapper'

export class OrmCategoryRepository extends Repository<OrmCategory> implements ICategoryRepository{

    private readonly ormCategoryMapper: OrmCategoryMapper

    constructor ( ormCategoryMapper: OrmCategoryMapper, dataSource: DataSource )
    {
        super( OrmCategory, dataSource.createEntityManager() )
        this.ormCategoryMapper = ormCategoryMapper
    }
    async findAllCategories (): Promise<Result<Category[]>>
    {
        try {
            const categories = await this.find()
            return Result.success<Category[]>( await Promise.all( categories.map( async ( category ) => await this.ormCategoryMapper.fromPersistenceToDomain( category ) ) ), 200 )
        } catch (error) {
            return Result.fail<Category[]>( error, error.code, error.detail )
        }
    }

    
    async findCategoryById ( id: string ): Promise<Result<Category>>
    {
        try{
            const category = await this.findOneBy( { id } )
            if ( category )
            {
                return Result.success<Category>( await this.ormCategoryMapper.fromPersistenceToDomain( category ), 200 )
            }
            return Result.fail<Category>( new Error( 'Categorie not found' ), 404, 'Categorie not found' )
        }catch (error) {
            return Result.fail<Category>( error, error.code, error.detail )
        }
    }

    

}


