import { Result } from "src/common/Domain/result-handler/Result";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Repository, DataSource } from "typeorm";
import { CourseSubscription } from "src/progress/domain/course-subscription";
import { OrmProgressCourse } from "../../entities/orm-entities/orm-progress-course";
import { OrmProgressCourseMapper } from "../../mappers/orm-mappers/orm-progress-course-mapper";
import { SectionProgress } from "src/progress/domain/entities/progress-section/section-progress";
import { OrmProgressSection } from "../../entities/orm-entities/orm-progress-section";
import { OrmProgressSectionMapper } from "../../mappers/orm-mappers/orm-progress-section-mapper";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface";
import { SectionProgressId } from "src/progress/domain/entities/progress-section/value-objects/section-progress-id";
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id";

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

    async getSectionProgressById (userId:string, sectionId:string): Promise<Result<SectionProgress>>
    {
        try
        {
            const progressSection = await this.ormProgressSectionRepository.findOneBy( {user_id:userId, section_id:sectionId} );
            let domainProgress:SectionProgress;
            if ( progressSection ) //Progress exists on DB
            {
                //Create domain progress
                domainProgress = await this.ormProgressSectionMapper.fromPersistenceToDomain(progressSection);
            }
            else
            {
                //Progress not found. Return result as "newly-started" section
                const newId:string = await this.uuidGenerator.generateId();
                domainProgress = SectionProgress.create(SectionProgressId.create(newId), SectionId.create(sectionId));
            }

            const progress = domainProgress;
            return Result.success<SectionProgress>( progress, 200 );
        }
        catch (error)
        {
            return Result.fail<SectionProgress>(new Error(error.message), error.code, error.message);
        }
    }

    async getCourseProgressById (userId:string, courseId:string): Promise<Result<CourseSubscription>>
    {
        try
        {
            const progressCourse = await this.findOneBy( {course_id: courseId, user_id: userId} );
            let domainProgress:CourseSubscription;
            if ( progressCourse ) //Progress exists on DB
            {
                //Create domain progress
                domainProgress = await this.ormProgressCourseMapper.fromPersistenceToDomain(progressCourse);
            }
            else
            {
                //Progress not found
                return Result.fail<CourseSubscription>(new Error("Subscription not found. Please start progress before retrieving it"), 404, "Subscription not found. Please start progress before retrieving it");
            }
            
            //Fetch associated course's sections
            const sectionsResult = await this.ormCourseRepository.findCourseSections(courseId);
            if (!sectionsResult.isSuccess())
            {
                return Result.fail<CourseSubscription>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
            }
            const sections = sectionsResult.Value;
            
            //Fetch associated section progress' entities from course's sections
            for (let section of sections)
            {
                let target:Result<SectionProgress> = await this.getSectionProgressById(userId, section.Id.Value);
                if (target.isSuccess()) //Progress found or created from scratch
                {
                    domainProgress.saveSection(<SectionProgress>(target.Value));
                }
                else //Some error found
                {
                    return Result.fail<CourseSubscription>(target.Error, target.StatusCode, target.Message); 
                }
            }

            const progress:CourseSubscription = domainProgress;
            return Result.success<CourseSubscription>( progress, 200 );
        }
        catch (error)
        {
            return Result.fail<CourseSubscription>(new Error(error.message), error.code, error.message);
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

    async saveSectionProgress (progress:SectionProgress, userId?:string, completionPercent?:number): Promise<Result<SectionProgress>>
    {
        try
        {
            const ormProgress = await this.ormProgressSectionMapper.fromDomainToPersistence(progress, userId, completionPercent);
            await this.ormProgressSectionRepository.save( ormProgress );

            return Result.success<SectionProgress>( progress, 200 );
        }
        catch ( error )
        {
            return Result.fail<SectionProgress>(new Error(error.message), error.code, error.message);
        }
    }

    async saveCourseProgress (progress:CourseSubscription, courseCompletionPercent?:number, sectionsCompletionPercent?:Map<string,number>): Promise<Result<CourseSubscription>>
    {
        try
        {
            const ormProgress = await this.ormProgressCourseMapper.fromDomainToPersistence(progress, courseCompletionPercent);
            await this.save( ormProgress );

            //to-do When saving a course, also save all associated sections. Feels like a fragile solution, not sure how to rework
            const progressSections = progress.Sections;
            for (let completionTuple of sectionsCompletionPercent)
            {
                for (let section of progressSections)
                {
                    if ( section.SectionId.equals(SectionId.create(completionTuple[0])) )
                    {
                        await this.saveSectionProgress( section, progress.UserId.Id, completionTuple[1] );
                    }
                }
            }

            return Result.success<CourseSubscription>( progress, 200 );
        }
        catch ( error )
        {
            return Result.fail<CourseSubscription>(new Error(error.message), error.code, error.message);
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

    async findAllStartedCourses (userId:string, pagination:PaginationDto): Promise<Result<CourseSubscription[]>>
    {
        try
        {
            const courses = await this.createQueryBuilder().select()
                                .where('user_id = :target', {target: userId})
                                .skip((pagination.page-1) * pagination.perPage)
                                .take(pagination.perPage)
                                .getMany();
            if (courses.length > 0)
            {
                const domainCourses = await Promise.all( courses.map( async course => await this.ormProgressCourseMapper.fromPersistenceToDomain(course) ) );
                for (let course of domainCourses)
                {
                    //Fetch associated course's sections
                    const sectionsResult = await this.ormCourseRepository.findCourseSections(course.CourseId.Value);
                    if (!sectionsResult.isSuccess())
                    {
                        return Result.fail<CourseSubscription[]>(sectionsResult.Error, sectionsResult.StatusCode, sectionsResult.Message);
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
                            return Result.fail<CourseSubscription[]>(target.Error, target.StatusCode, target.Message); 
                        }
                    }
                }
                return Result.success<CourseSubscription[]>( domainCourses, 200 );
            }
            return Result.fail<CourseSubscription[]>(new Error("No started courses found"), 404, "No started courses found");
        }
        catch (error)
        {
            return Result.fail<CourseSubscription[]>( new Error(error.message), error.code, error.message );
        }
    }
    
    async findAllStartedSections (userId:string, courseId:string, pagination:PaginationDto): Promise<Result<SectionProgress[]>>
    {
        try
        {
            //Get associated course
            const courseResult = await this.ormCourseRepository.findCourseById(courseId);
            if (!courseResult.isSuccess())
            {
                return Result.fail<SectionProgress[]>(new Error(courseResult.Message), courseResult.StatusCode, courseResult.Message);
            }
            const course = courseResult.Value;

            //Load all sections' progress
            let progressArray:Array<SectionProgress> = new Array<SectionProgress>();
            let skipCount:number = (pagination.page - 1) * pagination.perPage;
            for (let section of course.Sections)
            {
                let progressResult:Result<SectionProgress> = await this.getSectionProgressById(userId, section.Id.Value);
                if (!progressResult.isSuccess())
                {
                    return Result.fail<SectionProgress[]>(new Error(progressResult.Message), progressResult.StatusCode, progressResult.Message);
                }
                let progress:SectionProgress;
                if ( progress.VideoProgress.Value != 0) //Some progress found
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
                return Result.success<SectionProgress[]>( progressArray, 200 );
            }
            return Result.fail<SectionProgress[]>(new Error("No started sections found on course"), 404, "No started sections found on course");
        }
        catch (error)
        {
            return Result.fail<SectionProgress[]>( new Error(error.message), error.code, error.message );
        }
    }

    async findLatestCourse (userId:string): Promise<Result<{course: CourseSubscription, lastSeen: Date}>>
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
                return Result.fail<{course: CourseSubscription, lastSeen: Date}>(new Error("No progress found for this user"), 404, "No progress found for this user");
            }
            const latestCourseResult = await this.getCourseProgressById(ormCourseProgress.user_id, ormCourseProgress.course_id);
            if (!latestCourseResult.isSuccess())
            {
                return Result.fail<{course: CourseSubscription, lastSeen: Date}>(latestCourseResult.Error, latestCourseResult.StatusCode, latestCourseResult.Message);
            }
            const latestCourse = latestCourseResult.Value;

            const lastSeen = ormCourseProgress.last_seen_date;
            return Result.success<{course: CourseSubscription, lastSeen: Date}>({course: latestCourse, lastSeen: lastSeen}, 200);
        }
        catch (error)
        {
            return Result.fail<{course: CourseSubscription, lastSeen: Date}>( new Error(error.message), error.code, error.message);
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