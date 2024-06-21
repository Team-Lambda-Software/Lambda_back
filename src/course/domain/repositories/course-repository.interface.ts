import { Result } from "src/common/Domain/result-handler/Result"
import { Course } from "../course"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Section } from "../entities/section/section"
import { SectionComment } from "../entities/section-comment/section-comment"



export interface ICourseRepository
{

    findCourseById ( id: string ): Promise<Result<Course>>
    findCoursesByName ( name: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    findCourseSections ( id: string ): Promise<Result<Section[]>>
    addCommentToSection ( comment: SectionComment ): Promise<Result<SectionComment>>
    saveCourseAggregate ( course: Course ): Promise<Result<Course>>
    addSectionToCourse ( courseId: string, section: Section ): Promise<Result<Section>>

}