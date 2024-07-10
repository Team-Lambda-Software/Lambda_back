import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { GetAllSectionsFromCourseResponseDto } from "../dto/responses/get-all-sections-from-course-response.dto";
import { GetAllSectionsFromCourseEntryDto } from "../dto/parameters/get-all-sections-from-course-entry.dto";
import { ProgressQueryRepository } from "../../repositories/progress-query-repository.interface";
import { OdmProgressEntity } from "../../entities/odm-entities/odm-progress.entity";

export class GetCourseProgressService implements IApplicationService<GetAllSectionsFromCourseEntryDto, GetAllSectionsFromCourseResponseDto>
{
    private readonly progressRepository: ProgressQueryRepository;

    constructor ( progressRepository: ProgressQueryRepository )
    {
        this.progressRepository = progressRepository;
    }

    async execute(data:GetAllSectionsFromCourseEntryDto): Promise<Result<GetAllSectionsFromCourseResponseDto>>
    {
        let responseCourse:GetAllSectionsFromCourseResponseDto = {completionPercent: 0, sections: []};

        const courseProgressResult = await this.progressRepository.findProgressByCourseId(data.courseId, data.userId);
        if (!courseProgressResult.isSuccess())
        {
            return Result.fail<GetAllSectionsFromCourseResponseDto>(courseProgressResult.Error, courseProgressResult.StatusCode, courseProgressResult.Message);
        }
        const courseProgress:OdmProgressEntity = courseProgressResult.Value;

        responseCourse.completionPercent = courseProgress.completion_percent;
        responseCourse.sections = [];
        for (let section of courseProgress.section_progress)
        {
            let sectionResponse:{id:string, videoSecond:number, completionPercent:number} = {
                id: section.section_id,
                videoSecond: section.video_second,
                completionPercent: section.completion_percent
            };
            responseCourse.sections.push(sectionResponse);
        }

        return Result.success<GetAllSectionsFromCourseResponseDto>(responseCourse, 200);
    }

    get name():string
    {
        return this.constructor.name;
    }
}