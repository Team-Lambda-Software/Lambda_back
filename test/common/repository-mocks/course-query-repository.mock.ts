import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity"
import { OdmSectionCommentEntity } from "src/course/infraestructure/entities/odm-entities/odm-section-comment.entity"
import { CourseQueryRepository } from "src/course/infraestructure/repositories/course-query-repository.interface"



export class CourseQueryRepositoryMock implements CourseQueryRepository{

    private readonly courses: OdmCourseEntity[] = []
    private readonly sectionComments: OdmSectionCommentEntity[] = []
    private readonly sections: { id: string; name: string; duration: number; description: string; video: string }[] = []

    async saveCourse ( course: OdmCourseEntity ): Promise<void>
    {
        this.courses.push( course )
    }
    async addSectionToCourse ( courseId: string, section: { id: string; name: string; duration: number; description: string; video: string } ): Promise<void>
    {
        this.sections.push( section )
    }
    async addCommentToSection ( comment: OdmSectionCommentEntity ): Promise<void>
    {
        this.sectionComments.push( comment )
    }
    findCoursesByTagsAndName ( searchTags: string[], name: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findCourseById ( courseId: string ): Promise<Result<OdmCourseEntity>>
    {
        throw new Error( "Method not implemented." )
    }
    findSectionComments ( sectionId: string, pagination: PaginationDto ): Promise<Result<OdmSectionCommentEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findCoursesByCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findCoursesByTrainer ( trainerId: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findSectionById ( sectionId: string ): Promise<Result<{ id: string; name: string; duration: number; description: string; video: string }>>
    {
        throw new Error( "Method not implemented." )
    }
    findCourseBySectionId ( sectionId: string ): Promise<Result<OdmCourseEntity>>
    {
        throw new Error( "Method not implemented." )
    }
    findCourseCountByTrainer ( trainerId: string ): Promise<Result<number>>
    {
        throw new Error( "Method not implemented." )
    }
    findCourseCountByCategory ( categoryId: string ): Promise<Result<number>>
    {
        throw new Error( "Method not implemented." )
    }
    findCourseTags (): Promise<Result<string[]>>
    {
        throw new Error( "Method not implemented." )
    }

}