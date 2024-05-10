import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { Category } from "src/categories/domain/categories"
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto"




export class GetAllCategoriesApplicationService implements IApplicationService<ApplicationServiceEntryDto, Category[]> 
{
    private readonly categoryRepository: ICategoryRepository

    constructor ( categoryRepository: ICategoryRepository )
    {
        this.categoryRepository = categoryRepository
    }

    async execute ( data: ApplicationServiceEntryDto ): Promise<Result<Category[]>>
    {
        const resultCategories = await this.categoryRepository.findAllCategories()
        if ( !resultCategories.isSuccess() )
        {
            return Result.fail<Category[]>( resultCategories.Error, resultCategories.StatusCode, resultCategories.Message )
        }
        const categorie = resultCategories.Value
        const response: Category[] =  categorie 

        return Result.success<Category[]>( response, 200 )

    }

    get name (): string
    {
        return this.constructor.name
    }

}