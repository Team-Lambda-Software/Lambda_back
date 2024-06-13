import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { GetAllSectionsFromCourseResponseDto } from "../../dto/responses/get-all-sections-from-course-response.dto";
import { GetAllSectionsFromCourseEntryDto } from "../../dto/parameters/get-all-sections-from-course-entry.dto";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";

export class GetAllSectionsFromCourseApplicationService implements IApplicationService<GetAllSectionsFromCourseEntryDto, GetAllSectionsFromCourseResponseDto>
{
    private readonly progressRepository: IProgressCourseRepository;

    constructor ( progressRepository:IProgressCourseRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(data:GetAllSectionsFromCourseEntryDto): Promise<Result<GetAllSectionsFromCourseResponseDto>>
    {
        let returnData:GetAllSectionsFromCourseResponseDto;

        const courseProgressResult = await this.progressRepository.getCourseProgressById(data.userId, data.courseId);
        if (!courseProgressResult.isSuccess())
        {
            return Result.fail<GetAllSectionsFromCourseResponseDto>(courseProgressResult.Error, courseProgressResult.StatusCode, courseProgressResult.Message);
        }
        const courseProgress:ProgressCourse = courseProgressResult.Value;

        returnData.completionPercent = courseProgress.CompletionPercent;
        returnData.sections = [];
        for (let section of courseProgress.Sections)
        {
            let returnSection:{id:string, videoSecond:number, completionPercent:number};
            returnSection.id = section.SectionId;
            returnSection.videoSecond = section.VideoSecond;
            returnSection.completionPercent = section.CompletionPercent;
            returnData.sections.push(returnSection);
        }

        return Result.success<GetAllSectionsFromCourseResponseDto>(returnData, 200);
    }

    get name():string
    {
        return this.constructor.name;
    }
}