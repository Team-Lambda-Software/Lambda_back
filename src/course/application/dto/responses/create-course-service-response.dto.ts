import { Course } from "src/course/domain/course"
import { ProgressCourse } from "src/progress/domain/entities/progress-course"
import { ProgressSection } from "src/progress/domain/entities/progress-section"




export interface CreateCourseServiceResponseDto {

    id: string
    title: string
    description: string
    category: string
    image: string
    trainer: {
        id: string
        name: string
    }
    level: string
    durationWeeks: number
    durationMinutes: number
    tags: string[]
    date: Date
    lessons: {
        id: string
        title: string
        content: string
        video?: string
        image?: string
    }[]

}