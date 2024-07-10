import { CourseSubscription } from "src/progress/domain/course-subscription";
import { OdmProgressEntity } from "../../entities/odm-entities/odm-progress.entity";
import { CourseSubscriptionId } from "src/progress/domain/value-objects/course-subscription-id";
import { CourseProgressionDate } from "src/progress/domain/value-objects/course-progression-date";
import { CourseCompletion } from "src/progress/domain/value-objects/course-completed";
import { SectionProgress } from "src/progress/domain/entities/progress-section/section-progress";
import { SectionProgressId } from "src/progress/domain/entities/progress-section/value-objects/section-progress-id";
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id";
import { SectionCompletion } from "src/progress/domain/entities/progress-section/value-objects/section-completed";
import { SectionVideoProgress } from "src/progress/domain/entities/progress-section/value-objects/section-video-progress";
import { CourseId } from "src/course/domain/value-objects/course-id";
import { UserId } from "src/user/domain/value-objects/user-id";
import { IMapper } from "src/common/Application/mapper/mapper.interface";

export class OdmProgressMapper implements IMapper<CourseSubscription, OdmProgressEntity>
{
    fromDomainToPersistence (domain:CourseSubscription): Promise<OdmProgressEntity>
    {
        throw new Error("Method not implemented");
    }

    async fromPersistenceToDomain(progress:OdmProgressEntity): Promise<CourseSubscription>
    {
        const courseSubscription = CourseSubscription.create(
            CourseSubscriptionId.create(progress.progress_id),
            CourseProgressionDate.create(progress.last_seen_date),
            CourseCompletion.create(progress.completed),
            progress.section_progress.map(sectionProgress =>
                SectionProgress.create(
                    SectionProgressId.create(sectionProgress.progress_id),
                    SectionId.create(sectionProgress.section_id),
                    SectionCompletion.create(sectionProgress.completed),
                    SectionVideoProgress.create(sectionProgress.video_second)
                )
            ),
            CourseId.create(progress.course_id),
            UserId.create(progress.user_id)
        );

        return courseSubscription;
    }
}