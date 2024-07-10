import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { GetTrendingCourseResponseDto } from "../dto/responses/get-trending-course-response.dto";
import { Result } from "src/common/Domain/result-handler/Result";
import { ProgressQueryRepository } from "../../repositories/progress-query-repository.interface";

//* Latest course that was seen by user
export class GetTrendingCourseService implements IApplicationService<ApplicationServiceEntryDto, GetTrendingCourseResponseDto>
{
    private readonly progressRepository: ProgressQueryRepository

    constructor ( progressRepository:ProgressQueryRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(data:ApplicationServiceEntryDto): Promise<Result<GetTrendingCourseResponseDto>>
    {
        const latestCourseResult = await this.progressRepository.findLatestProgress(data.userId);
        if (!latestCourseResult.isSuccess())
        {
            return Result.fail<GetTrendingCourseResponseDto>(latestCourseResult.Error, latestCourseResult.StatusCode, latestCourseResult.Message);
        }
        const latestCourse = latestCourseResult.Value;

        const responseData = {completionPercent: latestCourse.completion_percent, courseTitle: latestCourse.course.name, courseId: latestCourse.course_id, lastTime: latestCourse.last_seen_date};
        return Result.success<GetTrendingCourseResponseDto>( responseData, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}