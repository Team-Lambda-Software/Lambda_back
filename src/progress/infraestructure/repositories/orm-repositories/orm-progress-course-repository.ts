import { Result } from "src/common/Domain/result-handler/Result";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Repository, DataSource } from "typeorm";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";
import { OrmProgressCourse } from "../../entities/orm-entities/orm-progress-course";
import { OrmProgressCourseMapper } from "../../mappers/orm-mappers/orm-progress-course-mapper";
import { ProgressSection } from "src/progress/domain/entities/progress-section";
import { OrmProgressSection } from "../../entities/orm-entities/orm-progress-section";
import { OrmProgressSectionMapper } from "../../mappers/orm-mappers/orm-progress-section-mapper";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";
//? Couple with OrmCourseRepository to get all info from courses and fully construct progress' objects
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository";
import { Course } from "src/course/domain/course";
//import { SectionVideo } from "src/course/domain/entities/compose-fields/section-video";
import { skip } from "node:test";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";

export class OrmProgressCourseRepository extends Repository<OrmProgressCourse> implements IProgressCourseRepository
{
    private readonly ormProgressCourseMapper: OrmProgressCourseMapper;
    private readonly ormProgressSectionMapper: OrmProgressSectionMapper;

    private readonly ormProgressSectionRepository: Repository<OrmProgressSection>;

    //? Couple with OrmCourseRepository?
    private readonly ormCourseRepository: ICourseRepository;
    //Couple with IdGenerator to create IDs for new progresses
    private readonly uuidGenerator: IdGenerator<string>;

    constructor (ormProgressCourseMapper:OrmProgressCourseMapper, ormProgressSectionMapper:OrmProgressSectionMapper, ormCourseRepository:ICourseRepository, dataSource:DataSource, uuidGenerator:IdGenerator<string>)
    {
        super( OrmProgressCourse, dataSource.createEntityManager() );
        this.ormProgressCourseMapper = ormProgressCourseMapper;
        this.ormProgressSectionMapper = ormProgressSectionMapper;

        this.ormProgressSectionRepository = dataSource.getRepository( OrmProgressSection );

        this.ormCourseRepository = ormCourseRepository;

        this.uuidGenerator = uuidGenerator;
    }

    //unused According to new specification of the API, video is now only one and part of the section. So, this method is not needed
        // async getVideoProgressById (userId:string, videoId:string): Promise<Result<ProgressVideo>>
        // {
        //     try
        //     {
        //         const progressVideo = await this.ormProgressVideoRepository.findOneBy( {video_id: videoId, user_id: userId} );
        //         if ( progressVideo ) //Video progress found on DB
        //         {
        //             return Result.success<ProgressVideo>(await this.ormProgressVideoMapper.fromPersistenceToDomain(progressVideo), 200);
        //         } //Progress not found. Return as newly-started video
        //         return Result.success<ProgressVideo>(ProgressVideo.create(userId, videoId, 0, false), 200);
        //     }
        //     catch (error)
        //     {
        //         return Result.fail<ProgressVideo>(new Error(error.message), error.code, error.message);
        //     }
        // }

    async getSectionProgressById (userId:string, sectionId:string): Promise<Result<ProgressSection>>
    {
        try
        {
            const progressSection = await this.ormProgressSectionRepository.findOneBy( {user_id:userId, section_id:sectionId} );
            let domainProgress:ProgressSection;
            if ( progressSection ) //Progress exists on DB
            {
                //TEST
                    console.log("Previous progress found. Printing ORM and Domain");
                    progressSection.completion_percent = <number>progressSection.completion_percent;
                    progressSection.video_second = <number>progressSection.video_second;
                    console.log(progressSection);
                //Create domain progress
                domainProgress = await this.ormProgressSectionMapper.fromPersistenceToDomain(progressSection);
                //TEST
                    console.log(domainProgress);
            }
            else
            {
                //TEST
                    console.log("Generating new uuid... No previous progress found");
                //Progress not found. Return result as "newly-started" section
                const newId:string = await this.uuidGenerator.generateId();
                domainProgress = ProgressSection.create(newId, sectionId);
            }

            const progress = domainProgress;
            return Result.success<ProgressSection>( progress, 200 );
        }
        catch (error)
        {
            return Result.fail<ProgressSection>(new Error(error.message), error.code, error.message);
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
                const newId:string = await this.uuidGenerator.generateId();
                domainProgress = ProgressCourse.create(newId, userId, courseId, false, []);
            }
            
            //Fetch associated course's sections
            const sectionsResult = await this.ormCourseRepository.findCourseSections(courseId);
            if (!sectionsResult.isSuccess())
            {
                return Result.fail<ProgressCourse>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
            }
            const sections = sectionsResult.Value;
            
            //Fetch associated section progress' entities from course's sections
            for (let section of sections)
            {
                let target:Result<ProgressSection> = await this.getSectionProgressById(userId, section.Id.Value);
                if (target.isSuccess()) //Progress found or created from scratch
                {
                    domainProgress.saveSection(<ProgressSection>(target.Value));
                }
                else //Some error found
                {
                    return Result.fail<ProgressCourse>(target.Error, target.StatusCode, target.Message); 
                }
            }

            const progress:ProgressCourse = domainProgress;
            return Result.success<ProgressCourse>( progress, 200 );
        }
        catch (error)
        {
            return Result.fail<ProgressCourse>(new Error(error.message), error.code, error.message);
        }
    }

    //unused According to new specification of the API, video is now only one and part of the section. So, this method is not needed
        // async saveVideoProgress (progress:ProgressVideo): Promise<Result<ProgressVideo>>
        // {
        //     try
        //     {
        //         const ormProgress = await this.ormProgressVideoMapper.fromDomainToPersistence(progress);
        //         await this.ormProgressVideoRepository.save( ormProgress );

        //         return Result.success<ProgressVideo>( progress, 200 );
        //     }
        //     catch ( error )
        //     {
        //         return Result.fail<ProgressVideo>(new Error(error.message), error.code, error.message);
        //     }
        // }

    async saveSectionProgress (progress:ProgressSection, userId?:string): Promise<Result<ProgressSection>>
    {
        try
        {
            //TEST
                console.log("Saving section progress");
            const ormProgress = await this.ormProgressSectionMapper.fromDomainToPersistence(progress, userId);
            //TEST
                console.log("Mapper done");
            await this.ormProgressSectionRepository.save( ormProgress );
            //TEST
                console.log("ORM saving done");

            return Result.success<ProgressSection>( progress, 200 );
        }
        catch ( error )
        {
            return Result.fail<ProgressSection>(new Error(error.message), error.code, error.message);
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
            return Result.fail<ProgressCourse>(new Error(error.message), error.code, error.message);
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
            return Result.fail<number>( new Error(error.message), error.code, error.message );
        }
    }

    async findAllStartedCourses (userId:string, pagination:PaginationDto): Promise<Result<ProgressCourse[]>>
    {
        try
        {
            const courses = await this.createQueryBuilder().select()
                                .where('user_id = :target', {target: userId})
                                .skip(pagination.page)
                                .take(pagination.perPage)
                                .getMany();
            if (courses.length > 0)
            {
                const domainCourses = await Promise.all( courses.map( async course => await this.ormProgressCourseMapper.fromPersistenceToDomain(course) ) );
                for (let course of domainCourses)
                {
                    //Fetch associated course's sections
                    const sectionsResult = await this.ormCourseRepository.findCourseSections(course.CourseId);
                    if (!sectionsResult.isSuccess())
                    {
                        return Result.fail<ProgressCourse[]>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
                    }
                    const sections = sectionsResult.Value;
                    //Fetch associated section progress' entities from course's sections
                    for (let section of sections)
                    {
                        let target = await this.getSectionProgressById(userId, section.Id.Value);
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
            return Result.fail<ProgressCourse[]>( new Error(error.message), error.code, error.message );
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
            let skipCount:number = pagination.page;
            for (let section of course.Sections)
            {
                let progressResult:Result<ProgressSection> = await this.getSectionProgressById(userId, section.Id.Value);
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
                if ( progressArray.length >= pagination.perPage )
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
            return Result.fail<ProgressSection[]>( new Error(error.message), error.code, error.message );
        }
    }

    async findLatestCourse (userId:string): Promise<Result<{course: ProgressCourse, lastSeen: Date}>>
    {
        try
        {
            const ormCourseProgress = await this.createQueryBuilder().select()
                                        .where('user_id = :target', {target: userId})
                                        .addOrderBy('last_seen_date', "DESC", "NULLS LAST")
                                        .take(1)
                                        .getOne();
            if (!ormCourseProgress) //No progress exists on DB
            {
                return Result.fail<{course: ProgressCourse, lastSeen: Date}>(new Error("No progress found for this user"), 404, "No progress found for this user");
            }
            const latestCourseResult = await this.getCourseProgressById(ormCourseProgress.user_id, ormCourseProgress.course_id);
            if (!latestCourseResult.isSuccess())
            {
                return Result.fail<{course: ProgressCourse, lastSeen: Date}>(latestCourseResult.Error, latestCourseResult.StatusCode, latestCourseResult.Message);
            }
            const latestCourse = latestCourseResult.Value;

            const lastSeen = ormCourseProgress.last_seen_date;
            return Result.success<{course: ProgressCourse, lastSeen: Date}>({course: latestCourse, lastSeen: lastSeen}, 200);
        }
        catch (error)
        {
            return Result.fail<{course: ProgressCourse, lastSeen: Date}>( new Error(error.message), error.code, error.message);
        }
    }

    //Returns viewtime in seconds
    async getTotalViewtime (userId:string): Promise<Result<number>>
    {
        try
        {
            const viewtime = await this.ormProgressSectionRepository.sum("video_second", {user_id:userId});
            return Result.success<number>( viewtime, 200 );
        }
        catch (error)
        {
            return Result.fail<number>( new Error(error.message), error.code, error.message );
        }
    }
}