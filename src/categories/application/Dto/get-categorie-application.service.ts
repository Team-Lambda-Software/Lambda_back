import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { SearchContentByCategoryEntryDto } from "./search-content-by-category-entry.dto" 
import { ICategoriRepository } from "src/categories/domain/repositories/categorie-repository.interface"
import { Result } from "src/common/Application/result-handler/Result"
import { GetCategorieServiceResponseDto } from "./get-categorie-service-response.dto" 




export class GetCategorieApplicationService implements IApplicationService<SearchContentByCategoryEntryDto, GetCategorieServiceResponseDto> 
{
    private readonly categorieRepository: ICategoriRepository

    constructor ( categorieRepository: ICategoriRepository )
    {
        this.categorieRepository = categorieRepository
    }

    async execute ( data: SearchContentByCategoryEntryDto ): Promise<Result<GetCategorieServiceResponseDto>>
    {
        const resultCategorie = await this.categorieRepository.findCategorieById( data.categoryId )
        if ( !resultCategorie.isSuccess() )
        {
            return Result.fail<GetCategorieServiceResponseDto>( resultCategorie.Error, resultCategorie.StatusCode, resultCategorie.Message )
        }
        const categorie = resultCategorie.Value
        const response: GetCategorieServiceResponseDto = { categorie }

        return Result.success<GetCategorieServiceResponseDto>( response, 200 )

    }

    get name (): string
    {
        return this.constructor.name
    }

}