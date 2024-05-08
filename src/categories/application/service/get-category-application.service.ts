import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { Category } from "src/categories/domain/categories"
import { GetCategoryServiceEntryDto } from "../Dto/param/get-category-service-entry.dto"




export class GetCategoryApplicationService implements IApplicationService<GetCategoryServiceEntryDto, Category> 
{
    private readonly categoryRepository: ICategoryRepository

    constructor ( categoryRepository: ICategoryRepository )
    {
        this.categoryRepository = categoryRepository
    }

    async execute ( data: GetCategoryServiceEntryDto ): Promise<Result<Category>>
    {
        const resultCategorie = await this.categoryRepository.findCategoryById( data.categoryId )
        if ( !resultCategorie.isSuccess() )
        {
            return Result.fail<Category>( resultCategorie.Error, resultCategorie.StatusCode, resultCategorie.Message )
        }
        const categorie = resultCategorie.Value
        const response: Category =  categorie 

        return Result.success<Category>( response, 200 )

    }

    get name (): string
    {
        return this.constructor.name
    }

}