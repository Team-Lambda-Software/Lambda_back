import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { SectionProgress } from "src/progress/domain/entities/progress-section/section-progress";
import { SaveSectionProgressServiceEntryDto } from "../../dto/parameters/save-progress-section-entry.dto";
import { SaveSectionProgressServiceResponseDto } from "../../dto/responses/save-section-progress-response.dto";
import { SectionCompletion } from "src/progress/domain/entities/progress-section/value-objects/section-completed";
import { CourseSubscription } from "src/progress/domain/course-subscription";
import { SectionProgressId } from "src/progress/domain/entities/progress-section/value-objects/section-progress-id";
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id";
import { SectionVideoProgress } from "src/progress/domain/entities/progress-section/value-objects/section-video-progress";
import { CalculateSectionCompletionPercentDomainService } from "src/progress/domain/services/calculate-section-completion-percent.service";
import { CalculateCourseCompletionPercentDomainService } from "src/progress/domain/services/calculate-course-completion-percent.service";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";
import { CourseCompletion } from "src/progress/domain/value-objects/course-completed";

export class SaveSectionProgressApplicationService implements IApplicationService<SaveSectionProgressServiceEntryDto, SaveSectionProgressServiceResponseDto>
{
    private readonly progressRepository: IProgressCourseRepository;
    private readonly courseRepository: ICourseRepository;
    private readonly eventHandler: IEventHandler;

    constructor ( progressRepository:IProgressCourseRepository, courseRepository:ICourseRepository, eventHandler:IEventHandler )
    {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
        this.eventHandler = eventHandler;
    }

    async execute(data: SaveSectionProgressServiceEntryDto): Promise<Result<SaveSectionProgressServiceResponseDto>>
    {
        const courseResult = await this.courseRepository.findCourseById(data.courseId);
        if (!courseResult.isSuccess())
        {
            return Result.fail<SaveSectionProgressServiceResponseDto>(courseResult.Error, courseResult.StatusCode, courseResult.Message);
        }
        const baseCourse = courseResult.Value;
        const sectionsResult = await this.courseRepository.findCourseSections(baseCourse.Id.Value);
        if (!sectionsResult.isSuccess())
        {
            return Result.fail<SaveSectionProgressServiceResponseDto>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
        }
        baseCourse.changeSections(sectionsResult.Value);

        const progressResult = await this.progressRepository.getCourseProgressById(data.userId, data.courseId);
        if (!progressResult.isSuccess())
        {
            return Result.fail<SaveSectionProgressServiceResponseDto>(progressResult.Error, progressResult.StatusCode, progressResult.Message);
        }
        const progressUpdate:CourseSubscription = progressResult.Value; progressUpdate.pullEvents();
        const sectionProgressId:SectionProgressId = progressUpdate.getSectionProgressIdBySectionId(SectionId.create(data.sectionId));

        let responseDTO:SaveSectionProgressServiceResponseDto = {courseWasCompleted:false, sectionWasCompleted:false};

        const sectionCompletionCalculator = new CalculateSectionCompletionPercentDomainService();
        const courseCompletionCalculator = new CalculateCourseCompletionPercentDomainService();

        let updateCompletion:SectionCompletion = undefined;
        let updateVideoProgress:SectionVideoProgress = undefined;
        if (data.isCompleted != undefined)
        { 
            updateCompletion = SectionCompletion.create(data.isCompleted); 
            responseDTO.sectionWasCompleted = data.isCompleted;
        }
        if (data.videoSecond != undefined) { updateVideoProgress = SectionVideoProgress.create(data.videoSecond); }

        progressUpdate.updateSectionProgress(sectionProgressId, updateVideoProgress, updateCompletion);
        progressUpdate.publishUserProgression(sectionProgressId, sectionCompletionCalculator.execute(baseCourse, progressUpdate, SectionId.create(data.sectionId)));

        const courseCompletionPercent = courseCompletionCalculator.execute(baseCourse, progressUpdate);
        if (courseCompletionPercent.Value === 100)
        {
            progressUpdate.updateCourseCompletion(CourseCompletion.create(true));
            responseDTO.courseWasCompleted = true;
        }

        let sectionCompletionPercentMap = new Map<string,number>();
        for (let section of progressUpdate.Sections)
        {
            sectionCompletionPercentMap.set(section.SectionId.Value, sectionCompletionCalculator.execute(baseCourse, progressUpdate, section.SectionId).Value);
        }

        const updateResult = await this.progressRepository.saveCourseProgress(progressUpdate, courseCompletionPercent.Value, sectionCompletionPercentMap);

        if (!updateResult.isSuccess())
        {
            return Result.fail<SaveSectionProgressServiceResponseDto>(updateResult.Error, updateResult.StatusCode, updateResult.Message);
        }

        //TEST
            const events = progressUpdate.pullEvents();
            //events.forEach(event => console.log(event.eventName, event));
        await this.eventHandler.publish ( events );
        return Result.success<SaveSectionProgressServiceResponseDto>( responseDTO, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}