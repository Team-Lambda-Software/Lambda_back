import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { GetTrendingCourseResponseDto } from "../../dto/responses/get-trending-course-response.dto";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { CalculateCourseCompletionPercentDomainService } from "src/progress/domain/services/calculate-course-completion-percent.service";

//* Latest course that was seen by user
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
        const lastSeenDate = latestCourseData.lastSeen;

        const trendingCourseResult = await this.courseRepository.findCourseById(trendingProgress.CourseId.Value);
        if (!trendingCourseResult.isSuccess())
        {
            return Result.fail<GetTrendingCourseResponseDto>(trendingCourseResult.Error, trendingCourseResult.StatusCode, trendingCourseResult.Message);
        }
        const trendingCourse = trendingCourseResult.Value;
        const sectionsResult = await this.courseRepository.findCourseSections(trendingCourse.Id.Value);
        if (!sectionsResult.isSuccess())
        {
            return Result.fail<GetTrendingCourseResponseDto>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
        }
        trendingCourse.changeSections(sectionsResult.Value);

        const courseCompletionPercentCalculator = new CalculateCourseCompletionPercentDomainService();
        const returnData = {completionPercent: courseCompletionPercentCalculator.execute(trendingCourse, trendingProgress).Value, courseTitle: trendingCourse.Name.Value, courseId: trendingProgress.CourseId.Value, lastTime: lastSeenDate};
        return Result.success<GetTrendingCourseResponseDto>( returnData, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}