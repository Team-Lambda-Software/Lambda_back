import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { InitiateCourseProgressEntryDto } from "../../dto/parameters/initiate-course-progress-entry.dto";
import { InitiateCourseProgressResponseDto } from "../../dto/responses/initiate-course-progress-response.dto";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { IEventHandler } from "src/common/Application/event-handler/event-handler.interface";
import { Result } from "src/common/Domain/result-handler/Result";

export class InitiateCourseProgressApplicationService implements IApplicationService<InitiateCourseProgressEntryDto, InitiateCourseProgressResponseDto>
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

    async execute(data: InitiateCourseProgressEntryDto): Promise<Result<InitiateCourseProgressResponseDto>> {
        const courseResult = await this.courseRepository.findCourseById(data.courseId);
        if (!courseResult.isSuccess())
        {
            return Result.fail<InitiateCourseProgressResponseDto>(courseResult.Error, courseResult.StatusCode, courseResult.Message);
        }
        const baseCourse = courseResult.Value;
        //TEST
            console.log("Managed to fetch course");

        const progressResult = await this.progressRepository.getCourseProgressById(data.userId, data.courseId);
        if (progressResult.isSuccess())
        {
            return Result.fail<InitiateCourseProgressResponseDto>(new Error("El progreso ya fue iniciado previamente. No se puede volver a iniciar"), 409, "El progreso ya fue iniciado previamente. No se puede volver a iniciar");
        }
        //TEST
            console.log("Previous progress nonexistent");


        const newCourseProgressResult = await this.progressRepository.startCourseProgress(data.userId, data.courseId);
        if (!newCourseProgressResult.isSuccess())
        {
            return Result.fail<InitiateCourseProgressResponseDto>(newCourseProgressResult.Error, newCourseProgressResult.StatusCode, newCourseProgressResult.Message);
        }
        const newCourseProgress = newCourseProgressResult.Value;
        newCourseProgress.initiateCourseProgress();
        //TEST
            console.log("New progress created");
        await this.progressRepository.saveCourseProgress(newCourseProgress, 0);
        //TEST
            console.log("New progress saved");

        await this.eventHandler.publish ( newCourseProgress.pullEvents() );
        //TEST
            console.log("Service success");
        return Result.success<InitiateCourseProgressResponseDto>( {message: "Curso iniciado con éxito"}, 200);
    }

    get name():string
    {
        return this.constructor.name;
    }
}