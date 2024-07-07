import { Result } from "src/common/Domain/result-handler/Result";
import { CourseSubscription } from "../course-subscription";
import { SectionProgress } from "../entities/progress-section/section-progress";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";


export interface IProgressCourseRepository
{
    getCourseProgressById (userId:string, courseId:string): Promise<Result<CourseSubscription>>;
    getSectionProgressById (userId:string, sectionId:string): Promise<Result<SectionProgress>>;
    //unused getVideoProgressById (userId:string, videoId:string): Promise<Result<ProgressVideo>>;

    findUserCountInCourse (courseId:string): Promise<Result<number>>;
    findAllStartedCourses (userId:string, pagination:PaginationDto): Promise<Result<CourseSubscription[]>>;
    findAllStartedSections (userId:string, courseId:string, pagination:PaginationDto): Promise<Result<SectionProgress[]>>;

    findLatestCourse (userId:string): Promise<Result<{course: CourseSubscription, lastSeen: Date}>>;
    getTotalViewtime (userId:string): Promise<Result<number>>;

    startCourseProgress (userId:string, courseId:string): Promise<Result<CourseSubscription>>;
    saveCourseProgress (progress:CourseSubscription, courseCompletionPercent?:number, sectionsCompletionPercent?:Map<string,number>): Promise<Result<CourseSubscription>>;
    saveSectionProgress (progress:SectionProgress, userId?:string, completionPercent?:number): Promise<Result<SectionProgress>>;
    //unused saveVideoProgress (progress:ProgressVideo): Promise<Result<ProgressVideo>>;
}