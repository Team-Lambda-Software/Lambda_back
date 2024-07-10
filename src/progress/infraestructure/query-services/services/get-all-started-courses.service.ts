import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { GetAllStartedCoursesEntryDto } from "../dto/parameters/get-all-started-courses-entry.dto";
import { GetAllStartedCoursesResponseDto } from "../dto/responses/get-all-started-courses-response.dto";
import { Result } from "src/common/Domain/result-handler/Result";
import { ProgressQueryRepository } from "../../repositories/progress-query-repository.interface";


export class GetAllStartedCoursesService implements IApplicationService<GetAllStartedCoursesEntryDto, GetAllStartedCoursesResponseDto>
{
    private readonly progressRepository: ProgressQueryRepository;

    constructor ( progressRepository:ProgressQueryRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(data:GetAllStartedCoursesEntryDto): Promise<Result<GetAllStartedCoursesResponseDto>>
    {
        const arrayProgressResult = await this.progressRepository.findAllStartedCourses(data.userId, data.pagination);
        if (!arrayProgressResult.isSuccess())
        {
            return Result.fail<GetAllStartedCoursesResponseDto>(arrayProgressResult.Error, arrayProgressResult.StatusCode, arrayProgressResult.Message);
        }
        const arrayProgress = arrayProgressResult.Value;

        let returnDataArray:Array< { id: string, title: string, image:string, date: Date, category: string, trainerName: string, completionPercent: number } > = [];
        for (let progress of arrayProgress)
        {
            const odmTrainer = progress.course.trainer;
            const trainerName = odmTrainer.first_name + " " + odmTrainer.first_last_name + " " + odmTrainer.second_last_name;

            const returnData = { 
                id: progress.course_id, 
                title: progress.course.name, 
                image: progress.course.image,
                date: progress.course.date,
                category: progress.course.category.categoryName, 
                trainerName: trainerName,
                completionPercent: progress.completion_percent
            };
            returnDataArray.push(returnData);
        }
        return Result.success<GetAllStartedCoursesResponseDto>( {courses: returnDataArray}, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}