import { Result } from "src/common/Application/result-handler/Result"
import { Course } from "src/course/domain/course"
import { Section } from "src/course/domain/entities/section"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { DataSource, Repository } from 'typeorm'
import { OrmCourse } from "../../entities/orm-entities/orm-course"
import { OrmCourseMapper } from "../../mappers/orm-mappers/orm-course-mapper"
import { InjectRepository } from "@nestjs/typeorm"
import { OrmSection } from "../../entities/orm-entities/orm-section"
import { OrmSectionImage } from "../../entities/orm-entities/orm-section-images"
import { OrmSectionVideo } from "../../entities/orm-entities/orm-section-videos"
import { OrmSectionComment } from "../../entities/orm-entities/orm-section-comment"





export class OrmCourseRepository extends Repository<OrmCourse> implements ICourseRepository
{


    private readonly ormCourseMapper: OrmCourseMapper


    private readonly ormSectionRepository: Repository<OrmSection>
    private readonly ormImageRepository: Repository<OrmSectionImage>
    private readonly ormVideoRepository: Repository<OrmSectionVideo>
    private readonly ormCommentRepository: Repository<OrmSectionComment>
    constructor ( ormCourseMapper: OrmCourseMapper, dataSource: DataSource )
    {
        super( OrmCourse, dataSource.createEntityManager() )
        this.ormCourseMapper = ormCourseMapper
        this.ormSectionRepository = dataSource.getRepository( OrmSection )
        this.ormImageRepository = dataSource.getRepository( OrmSectionImage )
        this.ormVideoRepository = dataSource.getRepository( OrmSectionVideo )
        this.ormCommentRepository = dataSource.getRepository( OrmSectionComment )
    }



    async findCourseById ( id: string ): Promise<Result<Course>>
    {
        try
        {
            const course = await this.findOneBy( { id } )
            const sections = await this.ormSectionRepository.findBy( { course_id: id } )
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
            course.sections = sections
            const courseImage = await this.ormImageRepository.findOneBy( { course_id: id } )
            course.image = courseImage
            
            if ( course )
            {
                return Result.success<Course>( await this.ormCourseMapper.fromPersistenceToDomain( course ), 200 )
            }
            return Result.fail<Course>( new Error( 'Course not found' ), 404, 'Course not found' )
        } catch ( error )
        {
            return Result.fail<Course>( new Error( error.detail ), error.code, error.detail )
        }
    }
    searchCoursesByName ( name: string ): Promise<Result<Course[]>>
    {
        throw new Error( "Method not implemented." )
    }
    findCourseSections ( id: string ): Promise<Result<Section[]>>
    {
        throw new Error( "Method not implemented." )
    }
    addCommentToSection ( sectionId: string, comment: Comment ): void
    {
        throw new Error( "Method not implemented." )
    }
    findCoursesByCategory ( categoryId: string ): Promise<Result<Course[]>>
    {
        throw new Error( "Method not implemented." )
    }

}