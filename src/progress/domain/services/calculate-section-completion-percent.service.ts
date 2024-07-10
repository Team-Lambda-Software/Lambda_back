import { Course } from "src/course/domain/course";
import { CourseSubscription } from "../course-subscription";
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id";
import { SectionNotExistsException } from "../exceptions/section-not-exists-exception";
import { SectionDuration } from "src/course/domain/entities/section/value-objects/section-duration";
import { SectionCompletionPercent } from "../entities/progress-section/value-objects/section-completion-percent";

export class CalculateSectionCompletionPercentDomainService {
    execute (course:Course, subscription:CourseSubscription, sectionId:SectionId):SectionCompletionPercent
    {
        if (!course.checkSectionExists(sectionId))
        {
            throw new SectionNotExistsException();
        }
        if (subscription.getCompletionBySectionId(sectionId).Value)
        {
            return SectionCompletionPercent.create(100);
        }

        const sectionDuration:SectionDuration = course.getSectionDuration(sectionId);
        const videoProgress = subscription.getVideoProgressBySectionId(sectionId);

        const completionPercent = SectionCompletionPercent.create(videoProgress.Value / sectionDuration.Value);
        return completionPercent;
    }
}