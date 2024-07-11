import { Result } from "src/common/Domain/result-handler/Result"
import { Querysynchronizer } from "src/common/Infraestructure/query-synchronizer/query-synchronizer"
import { SectionCreated } from "src/course/domain/events/section-created-event"
import { ProgressQueryRepository } from "../repositories/progress-query-repository.interface"
import { OrmProgressCourseRepository } from '../repositories/orm-repositories/orm-progress-course-repository';
import { UserQueryRepository } from "src/user/infraestructure/repositories/user-query-repository.interface"
import { v4 as uuidv4 } from 'uuid'
import { SectionProgress } from "src/progress/domain/entities/progress-section/section-progress"
import { SectionProgressId } from "src/progress/domain/entities/progress-section/value-objects/section-progress-id"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { SectionCompletion } from "src/progress/domain/entities/progress-section/value-objects/section-completed"
import { SectionVideoProgress } from "src/progress/domain/entities/progress-section/value-objects/section-video-progress"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"


export class SectionAddedQuerySynchronizer implements Querysynchronizer<SectionCreated>
{
    private readonly progressRepository: ProgressQueryRepository;
    private readonly proggresOrmRepository: OrmProgressCourseRepository;
    private readonly courseRepository: ICourseRepository

    constructor ( progressRepository:ProgressQueryRepository, proggresOrmRepository: OrmProgressCourseRepository, courseRepository: ICourseRepository)
    {
        this.progressRepository = progressRepository;
        this.proggresOrmRepository = proggresOrmRepository;
        this.courseRepository = courseRepository
    }
    async execute ( event: SectionCreated ): Promise<Result<string>>
    {
        try{
            const progresses = await this.progressRepository.findAllProgressByCourseId( event.courseId )
            if ( !progresses.isSuccess() )
            {
                return Result.fail<string>( progresses.Error, progresses.StatusCode, progresses.Message )
            }
            for ( let progress of progresses.Value )
            {
                
                const sectionProgress = {
                    progress_id: uuidv4(),
                    section_id: event.id,
                    completed: false,
                    completion_percent: 0,
                    video_second: 0
                }

                const sectionAdded = await this.courseRepository.findSectionById( event.id )
                if ( !sectionAdded.isSuccess() )
                {
                    return Result.fail<string>( sectionAdded.Error, sectionAdded.StatusCode, sectionAdded.Message )
                }
                let watchedSeconds = 0
                let totalSeconds = sectionAdded.Value.Duration.Value
                for ( let section of progress.section_progress ){
                    const sectionWatched = await this.courseRepository.findSectionById( section.section_id )
                    if ( !sectionWatched.isSuccess() )
                    {
                        return Result.fail<string>( sectionWatched.Error, sectionWatched.StatusCode, sectionWatched.Message )
                    }

                    if (section.completed)
                        watchedSeconds += sectionWatched.Value.Duration.Value
                    else
                        watchedSeconds += section.video_second
                    totalSeconds += sectionWatched.Value.Duration.Value
                }

                const completionPercent = ( watchedSeconds / totalSeconds ) * 100

                await this.progressRepository.changeCourseCompletitionPercent( event.courseId, progress.user_id, completionPercent)
                await this.proggresOrmRepository.changeCompletionPercent( progress.user_id, event.courseId,  completionPercent)
                const prog = SectionProgress.create( SectionProgressId.create ( sectionProgress.progress_id), SectionId.create( sectionProgress.section_id), SectionCompletion.create(sectionProgress.completed), SectionVideoProgress.create(sectionProgress.video_second))
                
                const p = await this.proggresOrmRepository.saveSectionProgress( prog, progress.user_id, 0)

                await this.progressRepository.addSectionProgressToCourse( sectionProgress, progress.progress_id )

                
            }
        }catch(error){
            return Result.fail<string>(error, 500, error.message)
        }
    }

}
