import { Result } from "src/common/Domain/result-handler/Result"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity"
import { OdmSectionCommentEntity } from "src/course/infraestructure/entities/odm-entities/odm-section-comment.entity"
import { CourseQueryRepository } from "src/course/infraestructure/repositories/course-query-repository.interface"



export class CourseQueryRepositoryMock implements CourseQueryRepository{
    findCoursesOrderByPopularity ( pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findCoursesByCategoryOrderByPopularity ( categoryId: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findCoursesByTrainerOrderByPopularity ( trainerId: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    async changeCourseMinutesDuration ( courseId: string, minutesDuration: number ): Promise<void>
    {
        await this.courses.map( course => {
            if ( course.id === courseId ){
                course.minutes_per_section = minutesDuration
            }})
    }

    private readonly courses: OdmCourseEntity[] = []
    private readonly sectionComments: OdmSectionCommentEntity[] = []

    async saveCourse ( course: OdmCourseEntity ): Promise<void>
    {
        this.courses.push( course )
    }
    async addSectionToCourse ( courseId: string, section: { id: string; name: string; duration: number; description: string; video: string } ): Promise<void>
    {
        const course = this.courses.find( course => course.id === courseId )
        if ( !course ){
            throw new Error( 'Course not found' )
        }
        this.courses.filter( course => course.id !== courseId )
        course.sections.push( section )
        this.courses.push( course )
    }
    async addCommentToSection ( comment: OdmSectionCommentEntity ): Promise<void>
    {
        this.sectionComments.push( comment )
    }
    findCoursesByTagsAndName ( searchTags: string[], name: string, pagination: PaginationDto ): Promise<Result<OdmCourseEntity[]>>
    {
        throw new Error( "Method not implemented." )
    }
    async findCourseById ( courseId: string ): Promise<Result<OdmCourseEntity>>
    {
        const course = this.courses.find( course => course.id === courseId )
        if ( course ){
            return Result.success<OdmCourseEntity>( course, 200 )
        }
        return Result.fail<OdmCourseEntity>( new Error( 'Course not found' ), 404, 'Course not found' )
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
    async findSectionById ( sectionId: string ): Promise<Result<{ id: string; name: string; duration: number; description: string; video: string }>>
    {
        const course = this.courses.find( course => course.sections.find( section => section.id === sectionId ) )
        if ( course ){
            const section = course.sections.find( section => section.id === sectionId )
            return Result.success<{ id: string; name: string; duration: number; description: string; video: string }>( section, 200 )
        }
        return Result.fail<{ id: string; name: string; duration: number; description: string; video: string }>( new Error( 'Section not found' ), 404, 'Section not found' )
    }
    async findCourseBySectionId ( sectionId: string ): Promise<Result<OdmCourseEntity>>
    {
        const course = this.courses.find( course => course.sections.find( section => section.id === sectionId ) )
        if ( course ){
            return Result.success<OdmCourseEntity>( course, 200 )
        }
        return Result.fail<OdmCourseEntity>( new Error( 'Course not found' ), 404, 'Course not found' )
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