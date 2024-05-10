import { Result } from "src/common/Application/result-handler/Result";
import { ProgressCourse } from "../entities/progress-course";
import { ProgressSection } from "../entities/progress-section";
import { ProgressVideo } from "../entities/progress-video";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";


export interface IProgressCourseRepository
{
    getCourseProgressById (userId:string, courseId:string): Promise<Result<ProgressCourse>>;
    getSectionProgressById (userId:string, sectionId:string): Promise<Result<ProgressSection>>;
    getVideoProgressById (userId:string, videoId:string): Promise<Result<ProgressVideo>>;

    findUserCountInCourse (courseId:string): Promise<Result<number>>;
    findAllStartedCourses (userId:string, pagination:PaginationDto): Promise<Result<ProgressCourse[]>>;
    findAllStartedSections (userId:string, courseId:string, pagination:PaginationDto): Promise<Result<ProgressSection[]>>;

    saveCourseProgress (progress:ProgressCourse): Promise<Result<ProgressCourse>>;
    saveSectionProgress (progress:ProgressSection): Promise<Result<ProgressSection>>;
    saveVideoProgress (progress:ProgressVideo): Promise<Result<ProgressVideo>>;
}