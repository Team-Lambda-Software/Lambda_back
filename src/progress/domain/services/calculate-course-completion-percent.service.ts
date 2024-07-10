import { Course } from "src/course/domain/course";
import { CourseSubscription } from "../course-subscription";
import { SectionNotExistsException } from "../exceptions/section-not-exists-exception";
import { SectionCompletionPercent } from "../entities/progress-section/value-objects/section-completion-percent";
import { CourseCompletionPercent } from "../value-objects/course-completion-percent";
import { CalculateSectionCompletionPercentDomainService } from "./calculate-section-completion-percent.service";

export class CalculateCourseCompletionPercentDomainService {
    execute (course:Course, subscription:CourseSubscription):CourseCompletionPercent
    {
        if (subscription.IsCompleted.Value)
        {
            return CourseCompletionPercent.create(100);
        }

        const calculateSectionCompletionService:CalculateSectionCompletionPercentDomainService = new CalculateSectionCompletionPercentDomainService();
        let sectionCompletions:SectionCompletionPercent[] = [];
        for (let sectionProgress of subscription.Sections)
        {
            sectionCompletions.push(calculateSectionCompletionService.execute(course, subscription, sectionProgress.SectionId));
        }
        
        let sum:number = 0;
        for (let completion of sectionCompletions)
        {
            sum += completion.Value;
        }

        const completionPercent = CourseCompletionPercent.create( Math.floor( sum / sectionCompletions.length ) );
        return completionPercent;
    }
}