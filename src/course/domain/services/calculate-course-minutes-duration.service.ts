import { Course } from "../course"
import { CourseMinutesDuration } from "../value-objects/course-minutes-duration"


export class CalculateCourseMinutesDurationDomainService {
    execute (course:Course):CourseMinutesDuration
    {
        let sum:number = 0;
        for (let section of course.Sections)
        {
            console.log(section.Duration.Value)
            sum += section.Duration.Value;
        }
        sum = Math.floor(sum / 60);

        return CourseMinutesDuration.create(sum);
    }
}