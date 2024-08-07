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
    

    async findSectionById ( id: string ): Promise<Result<Section>>
    {
        const section = this.sections.find( section => section.Id.Value === id )
        if ( !section )
        {
            return Result.fail<Section>( new Error('Section not found'), 404, 'Section not found')
        }
        return Result.success<Section>( section, 200 )
    }
    async findCourseBySectionId ( id: string ): Promise<Result<Course>>
    {
        const course = this.courses.find( course => course.Sections.find( section => section.Id.Value === id ) )
        if ( !course )
        {
            return Result.fail<Course>( new Error('Course not found'), 404, 'Course not found')
        }
        return Result.success<Course>( course, 200 )
    }

    async findCourseById ( id: string ): Promise<Result<Course>>
    {
        const course = this.courses.find( course => course.Id.Value === id )
        if ( !course )
        {
            return Result.fail<Course>( new Error('Course not found'), 404, 'Course not found')
        }
        return Result.success<Course>( course, 200 )
    }
    findCoursesByName ( name: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        throw new Error( "Method not implemented." )
    }
    async findCourseSections ( id: string ): Promise<Result<Section[]>>
    {
        const course = this.courses.find( course => course.Id.Value === id )
        if ( !course )
        {
            return Result.fail<Section[]>( new Error('Course not found'), 404, 'Course not found')
        }
        return Result.success<Section[]>( course.Sections, 200 )
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
        const course = this.courses.find( course => course.Id.Value === courseId )
        if ( !course )
        {
            return Result.fail<Section>( new Error('Course not found'), 404, 'Course not found')
        }
        course.changeSections( [section] )
        return Result.success( section, 200)
    }

}