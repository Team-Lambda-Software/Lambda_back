import { Result } from "src/common/Application/result-handler/Result";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Repository, DataSource } from "typeorm";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";
import { OrmProgressCourse } from "../../entities/orm-entities/orm-progress-course";
import { OrmProgressCourseMapper } from "../../mappers/orm-mappers/orm-progress-course-mapper";
import { ProgressSection } from "src/progress/domain/entities/progress-section";
import { OrmProgressSection } from "../../entities/orm-entities/orm-progress-section";
import { OrmProgressSectionMapper } from "../../mappers/orm-mappers/orm-progress-section-mapper";
import { ProgressVideo } from "src/progress/domain/entities/progress-video";
import { OrmProgressVideo } from "../../entities/orm-entities/orm-progress-video";
import { OrmProgressVideoMapper } from "../../mappers/orm-mappers/orm-progress-video-mapper";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";
//? Couple with OrmCourseRepository to get all info from courses and fully construct progress' objects
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository";
import { Course } from "src/course/domain/course";
import { Section } from "src/course/domain/entities/section";
import { SectionVideo } from "src/course/domain/entities/compose-fields/section-video";
import { skip } from "node:test";

export class OrmProgressCourseRepository extends Repository<OrmProgressCourse> implements IProgressCourseRepository
{
    private readonly ormProgressCourseMapper: OrmProgressCourseMapper;
    private readonly ormProgressSectionMapper: OrmProgressSectionMapper;
    private readonly ormProgressVideoMapper: OrmProgressVideoMapper;

    private readonly ormProgressSectionRepository: Repository<OrmProgressSection>;
    private readonly ormProgressVideoRepository: Repository<OrmProgressVideo>;

    //? Couple with OrmCourseRepository?
    private readonly ormCourseRepository: OrmCourseRepository;

    constructor (ormProgressCourseMapper:OrmProgressCourseMapper, ormProgressSectionMapper:OrmProgressSectionMapper, ormProgressVideoMapper:OrmProgressVideoMapper, ormCourseRepository:OrmCourseRepository, dataSource:DataSource)
    {
        super( OrmProgressCourse, dataSource.createEntityManager() );
        this.ormProgressCourseMapper = ormProgressCourseMapper;
        this.ormProgressSectionMapper = ormProgressSectionMapper;
        this.ormProgressVideoMapper = ormProgressVideoMapper;

        this.ormProgressSectionRepository = dataSource.getRepository( OrmProgressSection );
        this.ormProgressVideoRepository = dataSource.getRepository( OrmProgressVideo );

        this.ormCourseRepository = ormCourseRepository;
    }

    async getVideoProgressById (userId:string, videoId:string): Promise<Result<ProgressVideo>>
    {
        try
        {
            const progressVideo = await this.ormProgressVideoRepository.findOneBy( {video_id: videoId, user_id: userId} );
            if ( progressVideo ) //Video progress found on DB
            {
                return Result.success<ProgressVideo>(await this.ormProgressVideoMapper.fromPersistenceToDomain(progressVideo), 200);
            } //Progress not found. Return as newly-started video
            return Result.success<ProgressVideo>(ProgressVideo.create(userId, videoId, 0, false), 200);
        }
        catch (error)
        {
            return Result.fail<ProgressVideo>(new Error(error.detail), error.code, error.detail);
        }
    }

    async getSectionProgressById (userId:string, sectionId:string): Promise<Result<ProgressSection>>
    {
        try
        {
            const progressSection = await this.ormProgressSectionRepository.findOneBy( {section_id: sectionId, user_id: userId} );
            let domainProgress:ProgressSection;
            if ( progressSection ) //Progress exists on DB
            {
                //Create domain progress
                domainProgress = await this.ormProgressSectionMapper.fromPersistenceToDomain(progressSection);
            }
            else
            {
                //Progress not found. Return result as "newly-started" section
                domainProgress = ProgressSection.create(userId, sectionId, false, []);
            }
            
            //Fetch associated section
            const sectionResult = await this.ormCourseRepository.findSectionById(sectionId);
            if (!sectionResult.isSuccess())
            {
                return Result.fail<ProgressSection>(sectionResult.Error, sectionResult.StatusCode, sectionResult.Message);
            }
            const section = sectionResult.Value;
            
            //Fetch associated video progress' entities from section's videos
            
            let target = await this.getVideoProgressById(userId, section.Video.Id);
            if (target.isSuccess()) //Progress found or created from scratch
            {
                domainProgress.saveVideo(target.Value);
            }
            else //Some error found
            {
                return Result.fail<ProgressSection>(target.Error, target.StatusCode, target.Message); 
            }
        

            const progress = domainProgress;
            return Result.success<ProgressSection>( progress, 200 );
        }
        catch (error)
        {
            return Result.fail<ProgressSection>(new Error(error.detail), error.code, error.detail);
        }
    }

    async getCourseProgressById (userId:string, courseId:string): Promise<Result<ProgressCourse>>
    {
        try
        {
            const progressCourse = await this.findOneBy( {course_id: courseId, user_id: userId} );
            let domainProgress:ProgressCourse;
            if ( progressCourse ) //Progress exists on DB
            {
                //Create domain progress
                domainProgress = await this.ormProgressCourseMapper.fromPersistenceToDomain(progressCourse);
            }
            else
            {
                //Progress not found. Return result as "newly-started" course
                domainProgress = ProgressCourse.create(userId, courseId, false, []);
            }
            
            //Fetch associated course's sections
            const sectionsResult = await this.ormCourseRepository.findCourseSections(courseId, {limit:100000, offset:0});
            if (!sectionsResult.isSuccess())
            {
                return Result.fail<ProgressCourse>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
            }
            const sections = sectionsResult.Value;
            
            //Fetch associated section progress' entities from course's sections
            for (let section of sections)
            {
                let target = await this.getSectionProgressById(userId, section.Id);
                if (target.isSuccess()) //Progress found or created from scratch
                {
                    domainProgress.saveSection(target.Value);
                }
                else //Some error found
                {
                    return Result.fail<ProgressCourse>(target.Error, target.StatusCode, target.Message); 
                }
            }

            const progress = domainProgress;
            return Result.success<ProgressCourse>( progress, 200 );
        }
        catch (error)
        {
            return Result.fail<ProgressCourse>(new Error(error.detail), error.code, error.detail);
        }
    }

    async saveVideoProgress (progress:ProgressVideo): Promise<Result<ProgressVideo>>
    {
        try
        {
            const ormProgress = await this.ormProgressVideoMapper.fromDomainToPersistence(progress);
            await this.ormProgressVideoRepository.save( ormProgress );

            return Result.success<ProgressVideo>( progress, 200 );
        }
        catch ( error )
        {
            return Result.fail<ProgressVideo>(new Error(error.detail), error.code, error.detail);
        }
    }

    async saveSectionProgress (progress:ProgressSection): Promise<Result<ProgressSection>>
    {
        try
        {
            const ormProgress = await this.ormProgressSectionMapper.fromDomainToPersistence(progress);
            await this.ormProgressSectionRepository.save( ormProgress );

            return Result.success<ProgressSection>( progress, 200 );
        }
        catch ( error )
        {
            return Result.fail<ProgressSection>(new Error(error.detail), error.code, error.detail);
        }
    }

    async saveCourseProgress (progress:ProgressCourse): Promise<Result<ProgressCourse>>
    {
        try
        {
            const ormProgress = await this.ormProgressCourseMapper.fromDomainToPersistence(progress);
            await this.save( ormProgress );

            return Result.success<ProgressCourse>( progress, 200 );
        }
        catch ( error )
        {
            return Result.fail<ProgressCourse>(new Error(error.detail), error.code, error.detail);
        }
    }

    async findUserCountInCourse (courseId:string): Promise<Result<number>>
    {
        try
        {
            const userCount = await this.createQueryBuilder()
                                        .where('course_id = :id', {id: courseId})
                                        .getCount();
            
            if (userCount != null)
            {
                return Result.success<number>( userCount, 200 );
            }
            return Result.fail<number>( new Error("Users could not be counted"), 404, "Users could not be counted");
        }
        catch (error)
        {
            return Result.fail<number>( new Error(error.detail), error.code, error.detail );
        }
    }

    async findAllStartedCourses (userId:string, pagination:PaginationDto): Promise<Result<ProgressCourse[]>>
    {
        try
        {
            const courses = await this.createQueryBuilder().select()
                                .where('user_id = :target', {target: userId})
                                .skip(pagination.offset)
                                .take(pagination.limit)
                                .getMany();
            if (courses.length > 0)
            {
                const domainCourses = await Promise.all( courses.map( async course => await this.ormProgressCourseMapper.fromPersistenceToDomain(course) ) );
                for (let course of domainCourses)
                {
                    //Fetch associated course's sections
                    const sectionsResult = await this.ormCourseRepository.findCourseSections(course.CourseId, {limit:100000, offset:0});
                    if (!sectionsResult.isSuccess())
                    {
                        return Result.fail<ProgressCourse[]>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
                    }
                    const sections = sectionsResult.Value;
                    //Fetch associated section progress' entities from course's sections
                    for (let section of sections)
                    {
                        let target = await this.getSectionProgressById(userId, section.Id);
                        if (target.isSuccess()) //Progress found or created from scratch
                        {
                            course.saveSection(target.Value);
                        }
                        else //Some error found
                        {
                            return Result.fail<ProgressCourse[]>(target.Error, target.StatusCode, target.Message); 
                        }
                    }
                }
                return Result.success<ProgressCourse[]>( domainCourses, 200 );
            }
            return Result.fail<ProgressCourse[]>(new Error("No started courses found"), 404, "No started courses found");
        }
        catch (error)
        {
            return Result.fail<ProgressCourse[]>( new Error(error.detail), error.code, error.detail );
        }
    }
    
    async findAllStartedSections (userId:string, courseId:string, pagination:PaginationDto): Promise<Result<ProgressSection[]>>
    {
        try
        {
            //Get associated course
            const courseResult = await this.ormCourseRepository.findCourseById(courseId);
            if (!courseResult.isSuccess())
            {
                return Result.fail<ProgressSection[]>(new Error(courseResult.Message), courseResult.StatusCode, courseResult.Message);
            }
            const course = courseResult.Value;

            //Load all sections' progress
            let progressArray:Array<ProgressSection> = new Array<ProgressSection>();
            let skipCount:number = pagination.offset;
            for (let section of course.Sections)
            {
                let progressResult:Result<ProgressSection> = await this.getSectionProgressById(userId, section.Id);
                if (!progressResult.isSuccess())
                {
                    return Result.fail<ProgressSection[]>(new Error(progressResult.Message), progressResult.StatusCode, progressResult.Message);
                }
                let progress:ProgressSection;
                if ( progress.CompletionPercent != 0) //Some progress found
                {
                    if (skipCount > 0)
                    {
                        skipCount -= 1;
                    }
                    else
                    {
                        progressArray.push(progress);
                    }
                }
                if ( progressArray.length >= pagination.limit )
                {
                    break;
                }
            }

            //Check if any progress was found
            if (progressArray.length > 0)
            {
                return Result.success<ProgressSection[]>( progressArray, 200 );
            }
            return Result.fail<ProgressSection[]>(new Error("No started sections found on course"), 404, "No started sections found on course");
        }
        catch (error)
        {
            return Result.fail<ProgressSection[]>( new Error(error.detail), error.code, error.detail );
        }
    }
}