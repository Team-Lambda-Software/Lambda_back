import { Result } from "src/common/Domain/result-handler/Result"
import { Category } from "src/categories/domain/categories"
import { Repository, DataSource } from 'typeorm'
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { OrmCategory } from "../../entities/orm-entities/orm-category"
import { OrmCategoryMapper } from '../../mappers/orm-mappers/orm-category-mapper'
import { PaginationDto } from '../../../../common/Infraestructure/dto/entry/pagination.dto';

export class OrmCategoryRepository extends Repository<OrmCategory> implements ICategoryRepository{

    private readonly ormCategoryMapper: OrmCategoryMapper

    constructor ( ormCategoryMapper: OrmCategoryMapper, dataSource: DataSource )
    {
        super( OrmCategory, dataSource.createEntityManager() )
        this.ormCategoryMapper = ormCategoryMapper
    }
    async findAllCategories (pagination: PaginationDto): Promise<Result<Category[]>>
    {
        try {
            const categories = await this.find({skip: pagination.page, take: pagination.perPage})
            return Result.success<Category[]>( await Promise.all( categories.map( async ( category ) => await this.ormCategoryMapper.fromPersistenceToDomain( category ) ) ), 200 )
        } catch (error) {
            return Result.fail<Category[]>( error, error.code, error.message )
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
            return Result.fail (new Error(`category with id ${id} not found`),404, `category with id ${id} not found`)
        }catch (error) {
            return Result.fail<Category>( error, error.code, error.message )
        }
    }

    

}


