import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { InitiateCourseProgressEntryDto } from "../../dto/parameters/initiate-course-progress-entry.dto";
import { InitiateCourseProgressResponseDto } from "../../dto/responses/initiate-course-progress-response.dto";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { CourseSubscription } from "src/progress/domain/course-subscription";
import { CourseSubscriptionId } from "src/progress/domain/value-objects/course-subscription-id";
import { CourseProgressionDate } from "src/progress/domain/value-objects/course-progression-date";
import { CourseCompletion } from "src/progress/domain/value-objects/course-completed";
import { CourseId } from "src/course/domain/value-objects/course-id";
import { UserId } from "src/user/domain/value-objects/user-id";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { SectionProgress } from "src/progress/domain/entities/progress-section/section-progress";
import { SectionProgressId } from "src/progress/domain/entities/progress-section/value-objects/section-progress-id";
import { SectionCompletion } from "src/progress/domain/entities/progress-section/value-objects/section-completed";
import { SectionVideoProgress } from "src/progress/domain/entities/progress-section/value-objects/section-video-progress";

export class InitiateCourseProgressApplicationService implements IApplicationService<InitiateCourseProgressEntryDto, InitiateCourseProgressResponseDto>
{
    private readonly progressRepository: IProgressCourseRepository;
    private readonly courseRepository: ICourseRepository;
    private readonly eventHandler: IEventHandler;
    //Couple with IdGenerator to create IDs for new progresses
    private readonly uuidGenerator: IdGenerator<string>;

    constructor ( progressRepository:IProgressCourseRepository, courseRepository:ICourseRepository, eventHandler:IEventHandler, uuidGenerator:IdGenerator<string> )
    {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
        this.eventHandler = eventHandler;
        this.uuidGenerator = uuidGenerator;
    }

    async execute(data: InitiateCourseProgressEntryDto): Promise<Result<InitiateCourseProgressResponseDto>> {
        const courseResult = await this.courseRepository.findCourseById(data.courseId);
        if (!courseResult.isSuccess())
        {
            return Result.fail<InitiateCourseProgressResponseDto>(courseResult.Error, courseResult.StatusCode, courseResult.Message);
        }
        const baseCourse = courseResult.Value;

        const progressResult = await this.progressRepository.getCourseProgressById(data.userId, data.courseId);
        if (progressResult.isSuccess())
        {
            return Result.fail<InitiateCourseProgressResponseDto>(new Error("El progreso ya fue iniciado previamente. No se puede volver a iniciar"), 409, "El progreso ya fue iniciado previamente. No se puede volver a iniciar");
        }
        else
        {
            if(progressResult.StatusCode != 404) //! Coupling with a StatusCode in Application, not good
            {
                return Result.fail<InitiateCourseProgressResponseDto>(progressResult.Error, progressResult.StatusCode, progressResult.Message);
            }
        }

        const sectionsResult = await this.courseRepository.findCourseSections(data.courseId);
        if (!sectionsResult.isSuccess())
        {
            return Result.fail<InitiateCourseProgressResponseDto>(new Error("Course's sections could not be found. Cannot initialize"), 404, "Course's sections could not be found. Cannot initialize");
        }
        const sections = sectionsResult.Value;

        let progressSections:SectionProgress[] = [];
        for (const section of sections)
        {
            const newSectionId:string = await this.uuidGenerator.generateId();
            const sectionProgress = SectionProgress.create(SectionProgressId.create(newSectionId), section.Id, SectionCompletion.create(false), SectionVideoProgress.create(0));
            progressSections.push(sectionProgress);
        }
        const newId:string = await this.uuidGenerator.generateId();
        const newCourseProgress = CourseSubscription.create(CourseSubscriptionId.create(newId), CourseProgressionDate.create(new Date()), CourseCompletion.create(false), progressSections, baseCourse.Id, UserId.create(data.userId));
        
        await this.progressRepository.saveCourseProgress(newCourseProgress, 0);

        await this.eventHandler.publish ( newCourseProgress.pullEvents() );
        return Result.success<InitiateCourseProgressResponseDto>( {message: "Curso iniciado con éxito"}, 200);
    }

    get name():string
    {
        return this.constructor.name;
    }
}