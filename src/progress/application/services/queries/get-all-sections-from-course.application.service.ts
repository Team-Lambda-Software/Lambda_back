import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { GetAllSectionsFromCourseResponseDto } from "../../dto/responses/get-all-sections-from-course-response.dto";
import { GetAllSectionsFromCourseEntryDto } from "../../dto/parameters/get-all-sections-from-course-entry.dto";
import { CourseSubscription } from "src/progress/domain/course-subscription";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { CalculateCourseCompletionPercentDomainService } from "src/progress/domain/services/calculate-course-completion-percent.service";
import { CalculateSectionCompletionPercentDomainService } from "src/progress/domain/services/calculate-section-completion-percent.service";

export class GetAllSectionsFromCourseApplicationService implements IApplicationService<GetAllSectionsFromCourseEntryDto, GetAllSectionsFromCourseResponseDto>
{
    private readonly progressRepository: IProgressCourseRepository;
    private readonly courseRepository: ICourseRepository;

    constructor ( progressRepository:IProgressCourseRepository, courseRepository:ICourseRepository )
    {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
    }

    async execute(data:GetAllSectionsFromCourseEntryDto): Promise<Result<GetAllSectionsFromCourseResponseDto>>
    {
        let returnData:GetAllSectionsFromCourseResponseDto = {completionPercent: 0, sections: []};

        const courseProgressResult = await this.progressRepository.getCourseProgressById(data.userId, data.courseId);
        if (!courseProgressResult.isSuccess())
        {
            return Result.fail<GetAllSectionsFromCourseResponseDto>(courseProgressResult.Error, courseProgressResult.StatusCode, courseProgressResult.Message);
        }
        const courseProgress:CourseSubscription = courseProgressResult.Value;
        const courseResult = await this.courseRepository.findCourseById(data.courseId);
        if (!courseResult.isSuccess())
        {
            return Result.fail<GetAllSectionsFromCourseResponseDto>(courseResult.Error, courseResult.StatusCode, courseResult.Message);
        }
        const course = courseResult.Value;
        const sectionsResult = await this.courseRepository.findCourseSections(course.Id.Value);
        if (!sectionsResult.isSuccess())
        {
            return Result.fail<GetAllSectionsFromCourseResponseDto>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
        }
        course.changeSections(sectionsResult.Value);

        const courseCompletionPercentCalculator = new CalculateCourseCompletionPercentDomainService();
        returnData.completionPercent = courseCompletionPercentCalculator.execute(course, courseProgress).Value;
        returnData.sections = [];
        const sectionCompletionPercentCalculator = new CalculateSectionCompletionPercentDomainService();
        for (let section of courseProgress.Sections)
        {
            let returnSection:{id:string, videoSecond:number, completionPercent:number} = {
                id: section.SectionId.Value,
                videoSecond: section.VideoProgress.Value,
                completionPercent: sectionCompletionPercentCalculator.execute(course, courseProgress, section.SectionId).Value
            };
            returnData.sections.push(returnSection);
        }

        return Result.success<GetAllSectionsFromCourseResponseDto>(returnData, 200);
    }

    get name():string
    {
        return this.constructor.name;
    }
}