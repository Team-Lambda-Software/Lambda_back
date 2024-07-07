import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { ApplicationServiceEntryDto } from "src/common/Application/application-services/dto/application-service-entry.dto";
import { GetProgressProfileResponseDto } from "../../dto/responses/get-progress-profile-response.dto";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { CalculateCourseCompletionPercentDomainService } from "src/progress/domain/services/calculate-course-completion-percent.service";


export class GetProgressProfileApplicationService implements IApplicationService<ApplicationServiceEntryDto, GetProgressProfileResponseDto>
{
    private readonly progressRepository: IProgressCourseRepository;
    private readonly courseRepository: ICourseRepository;

    constructor ( progressRepository:IProgressCourseRepository, courseRepository:ICourseRepository )
    {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
    }

    async execute(data:ApplicationServiceEntryDto): Promise<Result<GetProgressProfileResponseDto>>
    {
        const latestProgressResult = await this.progressRepository.findLatestCourse(data.userId);
        if (!latestProgressResult.isSuccess())
        {
            return Result.fail<GetProgressProfileResponseDto>(latestProgressResult.Error, latestProgressResult.StatusCode, latestProgressResult.Message);
        }
        const latestProgress = (latestProgressResult.Value).course;

        const courseResult = await this.courseRepository.findCourseById(latestProgress.CourseId.Value);
        if (!courseResult.isSuccess())
        {
            return Result.fail<GetProgressProfileResponseDto>(courseResult.Error, courseResult.StatusCode, courseResult.Message);
        }
        const course = courseResult.Value;
        const sectionsResult = await this.courseRepository.findCourseSections(course.Id.Value);
        if (!sectionsResult.isSuccess())
        {
            return Result.fail<GetProgressProfileResponseDto>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
        }
        course.changeSections(sectionsResult.Value);

        const totalViewtimeResult = await this.progressRepository.getTotalViewtime(data.userId);
        if (!totalViewtimeResult.isSuccess())
        {
            return Result.fail<GetProgressProfileResponseDto>(totalViewtimeResult.Error, totalViewtimeResult.StatusCode, totalViewtimeResult.Message);
        }
        const totalViewtimeInHours = (totalViewtimeResult.Value) / 3600;

        const courseCompletionPercentCalculator = new CalculateCourseCompletionPercentDomainService();
        const returnData = {latestCompletionPercent: courseCompletionPercentCalculator.execute(course, latestProgress).Value, totalViewtimeInHours: totalViewtimeInHours};
        return Result.success<GetProgressProfileResponseDto>( returnData, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}