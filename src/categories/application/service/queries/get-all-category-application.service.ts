import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { Category } from "src/categories/domain/categories"
import { GetAllCategoryServiceEntryDto } from "../../Dto/param/get-all-category-service-entry.dto"
import { GetAllCategoriesServiceResponseDto } from "../../Dto/responses/get-all-category-service-response.dto"




export class GetAllCategoriesApplicationService implements IApplicationService<GetAllCategoryServiceEntryDto, GetAllCategoriesServiceResponseDto[]> 
{
    private readonly categoryRepository: ICategoryRepository

    constructor ( categoryRepository: ICategoryRepository )
    {
        this.categoryRepository = categoryRepository
    }

    async execute ( data: GetAllCategoryServiceEntryDto ): Promise<Result<GetAllCategoriesServiceResponseDto[]>>
    {
        let {page = 1, perPage = 10} = data.pagination
        page = page * perPage - perPage
        const resultCategories = await this.categoryRepository.findAllCategories({page, perPage})
        if ( !resultCategories.isSuccess() )
        {
            return Result.fail<GetAllCategoriesServiceResponseDto[]>( resultCategories.Error, resultCategories.StatusCode, resultCategories.Message )
        }
        const categorie = resultCategories.Value
        const response: GetAllCategoriesServiceResponseDto[] =  []

        for (const cat of categorie){
            response.push({
                id: cat.Id.Value,
                name: cat.Name.Value,
                icon: cat.Icon.Value
            })
        }

        return Result.success<GetAllCategoriesServiceResponseDto[]>( response, 200 )

    }

    get name (): string
    {
        return this.constructor.name
    }

}