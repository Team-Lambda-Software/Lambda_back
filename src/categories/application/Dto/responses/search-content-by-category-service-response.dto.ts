import { Blog } from "src/blog/domain/blog"
import { Course } from "src/course/domain/course"



export interface SearchContentByCategoryServiceResponseDto {

    courses: Course[]
    blogs: Blog[]

}