import { Blog } from "src/blog/domain/blog"
import { Course } from "src/course/domain/course"



export interface SearchAllServiceResponseDto
{

    courses: {
        id: string
        title: string
        image: string
        date: Date
        category: string
        trainer: string
    }[]
    blogs: {
        id: string
        title: string
        image: string
        date: Date
        category: string
        trainer: string
    }[]

}