import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer";
import { CourseQueryRepository } from "src/course/infraestructure/repositories/course-query-repository.interface";
import { ProgressQueryRepository } from "../repositories/progress-query-repository.interface";
import { OdmProgressEntity } from "../entities/odm-entities/odm-progress.entity";
import { Model } from "mongoose";
import { Result } from "src/common/Domain/result-handler/Result";
import { CourseSubscriptionCreated } from "src/progress/domain/events/course-subscription-created-event";

export class InitiateProgressQuerySynchronizer implements Querysynchronizer<CourseSubscriptionCreated>
{
    private readonly courseRepository: CourseQueryRepository;
    private readonly progressRepository: ProgressQueryRepository;
    private readonly progressModel: Model<OdmProgressEntity>
    constructor ( courseRepository:CourseQueryRepository, progressRepository:ProgressQueryRepository, progressModel:Model<OdmProgressEntity> )
    {
        this.courseRepository = courseRepository;
        this.progressRepository = progressRepository;
        this.progressModel = progressModel;
    }

    async execute(event: CourseSubscriptionCreated): Promise<Result<string>> 
    {
        const courseResult = await this.courseRepository.findCourseById(event.courseId);
        if (!courseResult.isSuccess())
        {
            return Result.fail<string>(courseResult.Error, courseResult.StatusCode, courseResult.Message);
        }
        const course = courseResult.Value;

        const persistenceProgress = new this.progressModel({
            progress_id: event.id,
            course_id: event.courseId,
            course: course,
            user_id: event.userId,
            completed: event.isCompleted,
            completion_percent: 0,
            last_seen_date: event.lastProgression,
            section_progress: event.sections.map(section => ({
                    progress_id:section.id,
                    section_id:section.sectionId,
                    completed:section.isCompleted,
                    completion_percent: 0, 
                    video_second:section.videoProgress
                })
            )
        });
        const errors = persistenceProgress.validateSync();
        if (errors) {
            return Result.fail<string>( errors, 400, errors.name )
        }

        try
        {
            //TEST
                console.log("Initiating...", persistenceProgress);
            await this.progressRepository.saveProgress(persistenceProgress);
        }
        catch (error)
        {
            return Result.fail<string>(error, 500, error.message);
        }

        return Result.success<string>( 'Success', 201 );
    }
}