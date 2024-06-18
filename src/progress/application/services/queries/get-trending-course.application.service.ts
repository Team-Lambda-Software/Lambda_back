import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { GetTrendingCourseResponseDto } from "../../dto/responses/get-trending-course-response.dto";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";

//to-do //! What is a 'trending' course? Also, why just one? Modeled temporarily as the latest course that was seen by user
export class GetTrendingCourseApplicationService implements IApplicationService<ApplicationServiceEntryDto, GetTrendingCourseResponseDto>
{
    private readonly progressRepository: IProgressCourseRepository;
    private readonly courseRepository: ICourseRepository;

    constructor ( progressRepository:IProgressCourseRepository, courseRepository:ICourseRepository )
    {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
    }

    async execute(data:ApplicationServiceEntryDto): Promise<Result<GetTrendingCourseResponseDto>>
    {
        const latestCourseResult = await this.progressRepository.findLatestCourse(data.userId);
        if (!latestCourseResult.isSuccess())
        {
            return Result.fail<GetTrendingCourseResponseDto>(latestCourseResult.Error, latestCourseResult.StatusCode, latestCourseResult.Message);
        }
        const latestCourseData = latestCourseResult.Value;

        const trendingProgress = latestCourseData.course;
        //TEST Not working?
            console.log("Trending course...");
            console.log(trendingProgress);
        const lastSeenDate = latestCourseData.lastSeen;

        const trendingCourseResult = await this.courseRepository.findCourseById(trendingProgress.CourseId);
        if (!trendingCourseResult.isSuccess())
        {
            return Result.fail<GetTrendingCourseResponseDto>(trendingCourseResult.Error, trendingCourseResult.StatusCode, trendingCourseResult.Message);
        }
        const trendingCourse = trendingCourseResult.Value;

        const returnData = {completionPercent: trendingProgress.CompletionPercent, courseTitle: trendingCourse.Name.Value, courseId: trendingProgress.CourseId, lastTime: lastSeenDate};
        return Result.success<GetTrendingCourseResponseDto>( returnData, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}