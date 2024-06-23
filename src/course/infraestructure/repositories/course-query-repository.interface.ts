import { Result } from "src/common/Domain/result-handler/Result"
import { Course } from "src/course/domain/course"
import { OdmCourseEntity } from "../entities/odm-entities/odm-course.entity"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OdmSectionCommentEntity } from "../entities/odm-entities/odm-section-comment.entity"
import { Section } from "src/course/domain/entities/section/section"
import { SectionComment } from "src/course/domain/entities/section-comment/section-comment"



export interface CourseQueryRepository {
    saveCourse ( course: OdmCourseEntity ): Promise<void>
    

    addSectionToCourse ( courseId: string, section: {id: string, name: string, duration: number, description: string, video: string;} ): Promise<void>
    

    addCommentToSection ( comment: OdmSectionCommentEntity ): Promise<void>
    

    findCoursesByTagsAndName ( searchTags: string[], name: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    

    findCourseById ( courseId: string ): Promise<Result<OdmCourseEntity>>
    

    findSectionComments ( sectionId: string, pagination: PaginationDto): Promise<Result<OdmSectionCommentEntity[]>>
    
    findCoursesByCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    

    findCoursesByTrainer ( trainerId: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    

    findSectionById ( sectionId: string ): Promise<Result<{id: string, name: string, duration: number, description: string, video: string}>>

    findCourseBySectionId ( sectionId: string ): Promise<Result<OdmCourseEntity>>
}