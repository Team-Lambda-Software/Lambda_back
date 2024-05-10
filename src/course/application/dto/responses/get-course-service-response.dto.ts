import { Course } from "src/course/domain/course"
import { ProgressCourse } from "src/progress/domain/entities/progress-course"
import { ProgressSection } from "src/progress/domain/entities/progress-section"




export interface GetCourseServiceResponseDto {

    course: Course

    courseProgress: ProgressCourse

    sectionsProgress: ProgressSection[] 

}