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
    findCourseBySectionId ( sectionId: string ): Promise<Result<Course>>
    findCoursesByCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    findCoursesByTrainer ( trainerId: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    findSectionById ( sectionId: string ): Promise<Result<Section>>
    findSectionComments ( sectionId: string, pagination: PaginationDto ): Promise<Result<SectionComment[]>>
    findAllTrainerCourses ( trainerId: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    findCoursesByLevels ( levels: number[], pagination: PaginationDto ): Promise<Result<Course[]>>
    saveCourseAggregate ( course: Course ): Promise<Result<Course>>
    addSectionToCourse ( courseId: string, section: Section ): Promise<Result<Section>>
    findCoursesByTags ( tags: string[], pagination: PaginationDto ): Promise<Result<Course[]>>
    findCoursesByTagsAndName ( tags: string[], name: string, pagination: PaginationDto ): Promise<Result<Course[]>>

}