import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { BlogQueryRepository } from "../../repositories/blog-query-repository.interface"
import { GetBlogCountServiceEntryDto } from "../dto/params/get-blog-count-service-entry.dto"



export class GetBlogCountService implements IApplicationService<GetBlogCountServiceEntryDto, number> {
    
    private readonly blogRepository: BlogQueryRepository

    constructor ( blogRepository: BlogQueryRepository )
    {
        this.blogRepository = blogRepository
    }
    
    async execute ( data: GetBlogCountServiceEntryDto ): Promise<Result<number>>
    {
        try{
            if (data.trainer) {
                return await this.blogRepository.findBlogCountByTrainer( data.trainer )
            }
            if (data.category) {
                return await this.blogRepository.findBlogCountByCategory( data.category )
            }
        }catch (error){
            return Result.fail<number>( error, 500, error.message )
        }
    }
    get name (): string
    {
        return this.constructor.name
    }

}