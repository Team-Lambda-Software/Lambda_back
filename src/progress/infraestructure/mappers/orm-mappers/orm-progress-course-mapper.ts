import { IMapper } from "src/common/Application/mapper/mapper.interface";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";
import { OrmProgressCourse } from "../../entities/orm-entities/orm-progress-course";

export class OrmProgressCourseMapper implements IMapper<ProgressCourse, OrmProgressCourse>
{
    async fromDomainToPersistence(domain: ProgressCourse): Promise<OrmProgressCourse> 
    {
        const persistenceProgress = OrmProgressCourse.create(domain.Id, domain.CourseId, domain.UserId, domain.IsCompleted, domain.CompletionPercent, new Date());
        return persistenceProgress;
    }

    async fromPersistenceToDomain(persistence: OrmProgressCourse): Promise<ProgressCourse> 
    {
        const domainProgress = ProgressCourse.create(persistence.progress_id, persistence.user_id, persistence.course_id, persistence.completed, []);
        return domainProgress; //? Is it alright to return without sections inside? Should service deal with this?
    }
}