import { Course } from "src/course/domain/course"
import { ProgressCourse } from "src/progress/domain/entities/progress-course"
import { User } from "src/user/domain/user"




export interface GetUserProfileServiceResponseDto {

    user: User

    courses: Course[]

    coursesProgress: {progress: ProgressCourse, completionPercent: number}[]

}