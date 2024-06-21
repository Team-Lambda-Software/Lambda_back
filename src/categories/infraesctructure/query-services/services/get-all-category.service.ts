import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { GetAllCategoryServiceEntryDto } from "../dto/param/get-all-category-service-entry.dto"
import { GetAllCategoriesServiceResponseDto } from "../dto/responses/get-all-category-service-response.dto"
import { OdmCategoryRepository } from "../../repositories/odm-repositories/odm-category-repository"




export class GetAllCategoriesService implements IApplicationService<GetAllCategoryServiceEntryDto, GetAllCategoriesServiceResponseDto[]> 
{
    private readonly categoryRepository: OdmCategoryRepository

    constructor ( categoryRepository: OdmCategoryRepository )
    {
        this.categoryRepository = categoryRepository
    }

    async execute ( data: GetAllCategoryServiceEntryDto ): Promise<Result<GetAllCategoriesServiceResponseDto[]>>
    {
        let {page = 1, perPage = 10} = data.pagination
        page = page * perPage - perPage
        const resultCategories = await this.categoryRepository.findAllCategories({page, perPage})
        if (!resultCategories.isSuccess()){
            return Result.fail<GetAllCategoriesServiceResponseDto[]>(resultCategories.Error, resultCategories.StatusCode, resultCategories.Message)
        }
        const categories: GetAllCategoriesServiceResponseDto[] = resultCategories.Value.map( category => ({
            id: category.id,
            name: category.categoryName,
            icon: category.icon
        }))
        return Result.success<GetAllCategoriesServiceResponseDto[]>( categories, 200 )

    }

    get name (): string
    {
        return this.constructor.name
    }

}