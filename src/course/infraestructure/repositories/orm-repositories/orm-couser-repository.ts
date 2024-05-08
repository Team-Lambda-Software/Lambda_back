import { Result } from "src/common/Application/result-handler/Result"
import { Course } from "src/course/domain/course"
import { Section } from "src/course/domain/entities/section"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { DataSource, Repository } from 'typeorm'
import { OrmCourse } from "../../entities/orm-entities/orm-course"
import { OrmCourseMapper } from "../../mappers/orm-mappers/orm-course-mapper"
import { OrmSection } from "../../entities/orm-entities/orm-section"
import { OrmSectionImage } from "../../entities/orm-entities/orm-section-images"
import { OrmSectionVideo } from "../../entities/orm-entities/orm-section-videos"
import { OrmSectionComment } from "../../entities/orm-entities/orm-section-comment"
import { OrmSectionMapper } from '../../mappers/orm-mappers/orm-section-mapper'
import { SectionComment } from "src/course/domain/entities/section-comment"
import { OrmSectionCommentMapper } from '../../mappers/orm-mappers/orm-section-comment-mapper'
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"





export class OrmCourseRepository extends Repository<OrmCourse> implements ICourseRepository
{


    private readonly ormCourseMapper: OrmCourseMapper
    private readonly ormSectionMapper: OrmSectionMapper
    private readonly ormSectionCommentMapper: OrmSectionCommentMapper

    private readonly ormSectionRepository: Repository<OrmSection>
    private readonly ormImageRepository: Repository<OrmSectionImage>
    private readonly ormVideoRepository: Repository<OrmSectionVideo>
    private readonly ormCommentRepository: Repository<OrmSectionComment>
    constructor ( ormCourseMapper: OrmCourseMapper, ormSectionMapper: OrmSectionMapper, ormSectionCommentMapper: OrmSectionCommentMapper, dataSource: DataSource )
    {
        super( OrmCourse, dataSource.createEntityManager() )
        this.ormSectionMapper = ormSectionMapper
        this.ormCourseMapper = ormCourseMapper
        this.ormSectionCommentMapper = ormSectionCommentMapper
        this.ormSectionRepository = dataSource.getRepository( OrmSection )
        this.ormImageRepository = dataSource.getRepository( OrmSectionImage )
        this.ormVideoRepository = dataSource.getRepository( OrmSectionVideo )
        this.ormCommentRepository = dataSource.getRepository( OrmSectionComment )
    }
    async saveCourseAggregate ( course: Course ): Promise<Result<Course>>
    {
        try {
            const newCourse = await this.ormCourseMapper.fromDomainToPersistence( course )
            const savedCourse = await this.save( newCourse )
            return Result.success<Course>( await this.ormCourseMapper.fromPersistenceToDomain( savedCourse ), 200 )
        } catch ( error )
        {
            return Result.fail<Course>( new Error( error.detail ), error.code, error.detail )
        
        }
    }
    async findCoursesByLevels ( levels: number[], pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.createQueryBuilder( 'course' ).leftJoinAndSelect('course.trainer','trainer').leftJoinAndSelect('course.tags', 'course_tags').where( 'course.level IN (:...levels)', { levels:  levels }  ).skip( pagination.offset ).take( pagination.limit ).getMany()
            
            if ( courses.length > 0 )
            {

                for ( const course of courses )
                {
                    const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                    course.sections = sections
                    const courseImage = await this.ormImageRepository.findOneBy( { course_id: course.id } )
                    course.image = courseImage

                }
                return Result.success<Course[]>( await Promise.all( courses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )
            }
            return Result.fail<Course[]>( new Error( 'Courses not found' ), 404, 'Courses not found' )
        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findAllTrainerCourses ( trainerId: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.find( { where: { trainer_id: trainerId }, skip: pagination.offset, take: pagination.limit } )

            if ( courses.length > 0 )
            {

                for ( const course of courses )
                {
                    const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                    course.sections = sections
                    const courseImage = await this.ormImageRepository.findOneBy( { course_id: course.id } )
                    course.image = courseImage

                }
                return Result.success<Course[]>( await Promise.all( courses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )
            }
            return Result.fail<Course[]>( new Error( 'Courses not found' ), 404, 'Courses not found' )
        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findSectionById ( sectionId: string ): Promise<Result<Section>>
    {
        try
        {
            const section = await this.ormSectionRepository.findOneBy( { id: sectionId } )
            if ( !section )
                return Result.fail<Section>( new Error( 'Section not found' ), 404, 'Section not found' )

            let sectionImages: OrmSectionImage[] = []
            let sectionVideos: OrmSectionVideo[] = []
            let sectionComments: OrmSectionComment[] = []

            const images = await this.ormImageRepository.findBy( { section_id: section.id } )
            const videos = await this.ormVideoRepository.findBy( { section_id: section.id } )
            const comments = await this.ormCommentRepository.findBy( { section_id: section.id } )
            sectionImages = sectionImages.concat( images )
            sectionVideos = sectionVideos.concat( videos )
            sectionComments = sectionComments.concat( comments )



            section.images = sectionImages.filter( image => image.section_id === section.id )
            section.videos = sectionVideos.filter( video => video.section_id === section.id )
            section.comments = sectionComments.filter( comment => comment.section_id === section.id )


            return Result.success<Section>( await this.ormSectionMapper.fromPersistenceToDomain( section ), 200 )
        } catch ( error )
        {
            return Result.fail<Section>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findSectionComments ( sectionId: string, pagination: PaginationDto ): Promise<Result<SectionComment[]>>
    {
        try
        {
            const comments = await this.ormCommentRepository.find( { where: { section_id: sectionId }, skip: pagination.offset, take: pagination.limit } )
            return Result.success<SectionComment[]>( await Promise.all( comments.map( async comment => await this.ormSectionCommentMapper.fromPersistenceToDomain( comment ) ) ), 200 )
        } catch ( error )
        {

            return Result.fail<SectionComment[]>( new Error( error.detail ), error.code, error.detail )

        }
    }

    async findCourseById ( id: string ): Promise<Result<Course>>
    {
        try
        {
            const course = await this.findOneBy( { id } )
            if ( course )
            {
                const courseImage = await this.ormImageRepository.findOneBy( { course_id: id } )
                course.image = courseImage


                return Result.success<Course>( await this.ormCourseMapper.fromPersistenceToDomain( course ), 200 )
            }
            return Result.fail<Course>( new Error( 'Course not found' ), 404, 'Course not found' )
        } catch ( error )
        {
            return Result.fail<Course>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findCoursesByName ( name: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.createQueryBuilder( 'course' ).leftJoinAndSelect('course.trainer','trainer').leftJoinAndSelect('course.tags', 'course_tags').where( 'LOWER(course.name) LIKE :name', { name: `%${ name.toLowerCase().trim() }%` } ).skip( pagination.offset ).take( pagination.limit ).getMany()

            if ( courses.length > 0 )
            {

                for ( const course of courses )
                {
                    const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                    course.sections = sections
                    const courseImage = await this.ormImageRepository.findOneBy( { course_id: course.id } )
                    course.image = courseImage

                }
                return Result.success<Course[]>( await Promise.all( courses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )
            }
            return Result.fail<Course[]>( new Error( 'Courses not found' ), 404, 'Courses not found' )
        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findCourseSections ( id: string, pagination: PaginationDto ): Promise<Result<Section[]>>
    {
        try
        {
            const sections = await this.ormSectionRepository.find( { where: { course_id: id }, skip: pagination.offset, take: pagination.limit } )
            let sectionImages: OrmSectionImage[] = []
            let sectionVideos: OrmSectionVideo[] = []
            let sectionComments: OrmSectionComment[] = []
            for ( const section of sections )
            {
                const images = await this.ormImageRepository.findBy( { section_id: section.id } )
                const videos = await this.ormVideoRepository.findBy( { section_id: section.id } )
                const comments = await this.ormCommentRepository.findBy( { section_id: section.id } )
                sectionImages = sectionImages.concat( images )
                sectionVideos = sectionVideos.concat( videos )
                sectionComments = sectionComments.concat( comments )
            }

            sections.forEach( section =>
            {
                section.images = sectionImages.filter( image => image.section_id === section.id )
                section.videos = sectionVideos.filter( video => video.section_id === section.id )
                section.comments = sectionComments.filter( comment => comment.section_id === section.id )
            } )

            return Result.success<Section[]>( await Promise.all( sections.map( async section => await this.ormSectionMapper.fromPersistenceToDomain( section ) ) ), 200 )
        } catch ( error )
        {
            return Result.fail<Section[]>( new Error( error.detail ), error.code, error.detail )
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
            return Result.fail<SectionComment>( new Error( error.detail ), error.code, error.detail )
        }
    }

    async findCoursesByCategory ( categoryId: string, pagination: PaginationDto ): Promise<Result<Course[]>>
    {
        try
        {
            const courses = await this.find( { where: { category_id: categoryId }, skip: pagination.offset, take: pagination.limit } )

            if ( courses.length > 0 )
            {

                for ( const course of courses )
                {
                    const sections = await this.ormSectionRepository.findBy( { course_id: course.id } )
                    course.sections = sections
                    const courseImage = await this.ormImageRepository.findOneBy( { course_id: course.id } )
                    course.image = courseImage

                }
                return Result.success<Course[]>( await Promise.all( courses.map( async course => await this.ormCourseMapper.fromPersistenceToDomain( course ) ) ), 200 )
            }
            return Result.fail<Course[]>( new Error( 'Courses not found' ), 404, 'Courses not found' )
        } catch ( error )
        {
            return Result.fail<Course[]>( new Error( error.detail ), error.code, error.detail )
        }
    }

}