import { Blog } from "src/blog/domain/blog"
import { Course } from "src/course/domain/course"



export interface SearchAllServiceResponseDto
{

    courses: Course[]
    blogs: Blog[]

}