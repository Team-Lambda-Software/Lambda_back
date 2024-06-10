import { Result } from "src/common/Application/result-handler/Result"
import { Course } from "src/course/domain/course"
import { Section } from "src/course/domain/entities/section"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { DataSource, Repository } from 'typeorm'
import { OrmCourse } from "../../entities/orm-entities/orm-course"
import { OrmCourseMapper } from "../../mappers/orm-mappers/orm-course-mapper"
import { OrmSection } from "../../entities/orm-entities/orm-section"
import { OrmSectionComment } from "../../entities/orm-entities/orm-section-comment"
import { OrmSectionMapper } from '../../mappers/orm-mappers/orm-section-mapper'
import { SectionComment } from "src/course/domain/entities/section-comment"
import { OrmSectionCommentMapper } from '../../mappers/orm-mappers/orm-section-comment-mapper'
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { OrmCourseTags } from "../../entities/orm-entities/orm-course-tags"





export class OrmCourseRepository extends Repository<OrmCourse> implements ICourseRepository
{


    private readonly ormCourseMapper: OrmCourseMapper
    private readonly ormSectionMapper: OrmSectionMapper
    private readonly ormSectionCommentMapper: OrmSectionCommentMapper

    private readonly ormSectionRepository: Repository<OrmSection>
    private readonly ormTagRepistory: Repository<OrmCourseTags>
    private readonly ormCommentRepository: Repository<OrmSectionComment>
    constructor ( ormCourseMapper: OrmCourseMapper, ormSectionMapper: OrmSectionMapper, ormSectionCommentMapper: OrmSectionCommentMapper, dataSource: DataSource )
    {
        super( OrmCourse, dataSource.createEntityManager() )
        this.ormSectionMapper = ormSectionMapper
        this.ormCourseMapper = ormCourseMapper
        this.ormSectionCommentMapper = ormSectionCommentMapper
        this.ormSectionRepository = dataSource.getRepository( OrmSection )
        this.ormCommentRepository = dataSource.getRepository( OrmSectionComment )
        this.ormTagRepistory = dataSource.getRepository( OrmCourseTags )

    }
    async findCoursesByTagsAndName ( tags: string[], name: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.createQueryBuilder( 'course' ).leftJoinAndSelect( 'course.trainer', 'trainer' ).leftJoinAndSelect( 'course.tags', 'course_tags' ).where( 'LOWER(course.name) LIKE :name', { name: `%${ name.toLowerCase().trim() }%` } ).orderBy( 'course.date', 'DESC' ).getMany()
            let filteredCourses = courses.filter( course => tags.every( tag => course.tags.some( courseTag => courseTag.name === tag ) ) )

            if ( filteredCourses.length <= pagination.page && filteredCourses.length > 0 )
                return Result.fail<Course[]>( new Error( 'page execedes lenght of courses' ), 404, 'page execedes lenght of courses' )

            filteredCourses = filteredCourses.slice( pagination.page, pagination.perPage )


            for ( const course of filteredCourses )
            {
                const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                course.sections = sections

            }
            return Result.success<Course[]>( await Promise.all( filteredCourses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )
        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.message ), error.code, error.message )
        }
    }

    async addSectionToCourse ( courseId: string, section: Section ): Promise<Result<Section>>
    {
        try
        {
            const newSection = await this.ormSectionMapper.fromDomainToPersistence( section )
            newSection.course_id = courseId
            const savedSection = await this.ormSectionRepository.save( newSection )
            return Result.success<Section>( await this.ormSectionMapper.fromPersistenceToDomain( savedSection ), 200 )

        } catch ( error )
        {
            return Result.fail<Section>( error, error.code, error.message )
        }
    }
    async findCoursesByTrainer ( trainerId: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.find( { where: { trainer_id: trainerId }, order: { date: 'DESC' }, skip: pagination.page, take: pagination.perPage } )

            for ( const course of courses )
            {
                const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                course.sections = sections

            }
            return Result.success<Course[]>( await Promise.all( courses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.message ), error.code, error.message )
        }
    }
    async findCoursesByTags ( tags: string[], pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.find( { order: { date: 'DESC' } } )
            let filteredCourses = courses.filter( course => tags.every( tag => course.tags.some( courseTag => courseTag.name === tag ) ) )

            if ( filteredCourses.length <= pagination.page && filteredCourses.length > 0 )
                return Result.fail<Course[]>( new Error( 'page execedes lenght of courses' ), 404, 'page execedes lenght of courses' )

            filteredCourses = filteredCourses.slice( pagination.page, pagination.perPage )

            for ( const course of filteredCourses )
            {
                const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                course.sections = sections

            }
            return Result.success<Course[]>( await Promise.all( filteredCourses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )
        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.message ), error.code, error.message )
        }
    }
    async saveCourseAggregate ( course: Course ): Promise<Result<Course>>
    {
        try
        {
            const newCourse = await this.ormCourseMapper.fromDomainToPersistence( course )
            await this.ormTagRepistory.save( course.Tags.map( tag => OrmCourseTags.create( tag ) ) )
            const savedCourse = await this.save( newCourse )
            return Result.success<Course>( course, 200 )
        } catch ( error )
        {
            return Result.fail<Course>( new Error( error.message ), error.code, error.message )

        }
    }
    async findCoursesByLevels ( levels: number[], pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.createQueryBuilder( 'course' ).leftJoinAndSelect( 'course.trainer', 'trainer' ).leftJoinAndSelect( 'course.tags', 'course_tags' ).where( 'course.level IN (:...levels)', { levels: levels } ).orderBy( 'course.date', 'DESC' ).skip( pagination.page ).take( pagination.perPage ).getMany()

            for ( const course of courses )
            {
                const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                course.sections = sections
            }
            return Result.success<Course[]>( await Promise.all( courses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.message ), error.code, error.message )
        }
    }

    async findAllTrainerCourses ( trainerId: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.find( { where: { trainer_id: trainerId }, order: { date: 'DESC' }, skip: pagination.page, take: pagination.perPage } )


            for ( const course of courses )
            {
                const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                course.sections = sections

            }
            return Result.success<Course[]>( await Promise.all( courses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.message ), error.code, error.message )
        }
    }

    async findSectionById ( sectionId: string ): Promise<Result<Section>>
    {
        try
        {
            const section = await this.ormSectionRepository.findOneBy( { id: sectionId } )
            if ( !section )
                return Result.fail<Section>( new Error( 'Section not found' ), 404, 'Section not found' )

            let sectionComments: OrmSectionComment[] = []

            const comments = await this.ormCommentRepository.findBy( { section_id: section.id } )
            sectionComments = sectionComments.concat( comments )

            section.comments = sectionComments.filter( comment => comment.section_id === section.id )


            return Result.success<Section>( await this.ormSectionMapper.fromPersistenceToDomain( section ), 200 )
        } catch ( error )
        {
            return Result.fail<Section>( new Error( error.message ), error.code, error.message )
        }
    }

    async findSectionComments ( sectionId: string, pagination: PaginationDto ): Promise<Result<SectionComment[]>>
    {
        try
        {
            const comments = await this.ormCommentRepository.find( { where: { section_id: sectionId }, skip: pagination.page, take: pagination.perPage } )
            return Result.success<SectionComment[]>( await Promise.all( comments.map( async comment => await this.ormSectionCommentMapper.fromPersistenceToDomain( comment ) ) ), 200 )
        } catch ( error )
        {

            return Result.fail<SectionComment[]>( new Error( error.message ), error.code, error.message )

        }
    }

    async findCourseById ( id: string ): Promise<Result<Course>>
    {
        try
        {
            const course = await this.findOneBy( { id } )
            if ( course )
            {

                return Result.success<Course>( await this.ormCourseMapper.fromPersistenceToDomain( course ), 200 )
            }
            return Result.fail<Course>( new Error( 'Course not found' ), 404, 'Course not found' )
        } catch ( error )
        {
            return Result.fail<Course>( new Error( error.message ), error.code, error.message )
        }
    }

    async findCoursesByName ( name: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.createQueryBuilder( 'course' ).leftJoinAndSelect( 'course.trainer', 'trainer' ).leftJoinAndSelect( 'course.tags', 'course_tags' ).where( 'LOWER(course.name) LIKE :name', { name: `%${ name.toLowerCase().trim() }%` } ).orderBy( 'course.date', 'DESC' ).skip( pagination.page ).take( pagination.perPage ).getMany()


            for ( const course of courses )
            {
                const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                course.sections = sections

            }
            return Result.success<Course[]>( await Promise.all( courses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.message ), error.code, error.message )
        }
    }

    async findCourseSections ( id: string ): Promise<Result<Section[]>>
    {
        try
        {
            const sections = await this.ormSectionRepository.find( { where: { course_id: id } } )
            for ( const section of sections )
            {
                const comments = await this.ormCommentRepository.findBy( { section_id: section.id } )
                section.comments = comments
            }

            return Result.success<Section[]>( await Promise.all( sections.map( async section => await this.ormSectionMapper.fromPersistenceToDomain( section ) ) ), 200 )
        } catch ( error )
        {
            return Result.fail<Section[]>( new Error( error.message ), error.code, error.message )
        }
    }

    async addCommentToSection ( comment: SectionComment ): Promise<Result<SectionComment>>
    {
        try
        {
            const newComment: OrmSectionComment = await this.ormSectionCommentMapper.fromDomainToPersistence( comment )
            await this.ormCommentRepository.save( newComment )
            return Result.success<SectionComment>( await this.ormSectionCommentMapper.fromPersistenceToDomain( newComment ), 200 )
        } catch ( error )
        {
            return Result.fail<SectionComment>( new Error( error.message ), error.code, error.message )
        }
    }

    async findCoursesByCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.find( { where: { category_id: categoryId }, order: { date: 'DESC' }, skip: pagination.page, take: pagination.perPage } )

            for ( const course of courses )
            {
                const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                course.sections = sections

            }
            return Result.success<Course[]>( await Promise.all( courses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )

        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.message ), error.code, error.message )
        }
    }

}