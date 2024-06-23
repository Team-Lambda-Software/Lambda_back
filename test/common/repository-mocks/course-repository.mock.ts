import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { Course } from "src/course/domain/course"
import { SectionComment } from "src/course/domain/entities/section-comment/section-comment"
import { Section } from "src/course/domain/entities/section/section"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"



export class CourseRepositoryMock implements ICourseRepository{
    
    private readonly courses: Course[] = []
    private readonly sections: Section[] = []
    private readonly sectionComments: SectionComment[] = []
    
    findCourseById ( id: string ): Promise<Result<Course>>
    {
        throw new Error( "Method not implemented." )
    }
    findCoursesByName ( name: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findCourseSections ( id: string ): Promise<Result<Section[]>>
    {
        throw new Error( "Method not implemented." )
    }
    async addCommentToSection ( comment: SectionComment ): Promise<Result<SectionComment>>
    {
        this.sectionComments.push( comment )
        return Result.success( comment, 200)
    }
    async saveCourseAggregate ( course: Course ): Promise<Result<Course>>
    {
        this.courses.push( course )
        return Result.success( course, 200)
    }
    async addSectionToCourse ( courseId: string, section: Section ): Promise<Result<Section>>
    {
        this.sections.push( section )
        return Result.success( section, 200)
    }

}