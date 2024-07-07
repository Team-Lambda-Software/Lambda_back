import { Course } from "src/course/domain/course"




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