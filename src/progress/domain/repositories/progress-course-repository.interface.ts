import { Result } from "src/common/Domain/result-handler/Result";
import { ProgressCourse } from "../entities/progress-course";
import { ProgressSection } from "../entities/progress-section/section-progress";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";


export interface IProgressCourseRepository
{
    getCourseProgressById (userId:string, courseId:string): Promise<Result<ProgressCourse>>;
    getSectionProgressById (userId:string, sectionId:string): Promise<Result<ProgressSection>>;
    //unused getVideoProgressById (userId:string, videoId:string): Promise<Result<ProgressVideo>>;

    findUserCountInCourse (courseId:string): Promise<Result<number>>;
    findAllStartedCourses (userId:string, pagination:PaginationDto): Promise<Result<ProgressCourse[]>>;
    findAllStartedSections (userId:string, courseId:string, pagination:PaginationDto): Promise<Result<ProgressSection[]>>;

    findLatestCourse (userId:string): Promise<Result<{course: ProgressCourse, lastSeen: Date}>>;
    getTotalViewtime (userId:string): Promise<Result<number>>;

    saveCourseProgress (progress:ProgressCourse): Promise<Result<ProgressCourse>>;
    saveSectionProgress (progress:ProgressSection, userId?:string): Promise<Result<ProgressSection>>;
    //unused saveVideoProgress (progress:ProgressVideo): Promise<Result<ProgressVideo>>;
}