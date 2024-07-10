import { Result } from "src/common/Domain/result-handler/Result";
import { OdmProgressEntity } from "../entities/odm-entities/odm-progress.entity";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";

export interface ProgressQueryRepository {
    saveProgress (progress: OdmProgressEntity): Promise<void>;
    updateProgress (progress:OdmProgressEntity): Promise<Result<string>>;

    findProgressByCourseId (courseId:string, userId:string): Promise<Result<OdmProgressEntity>>;
    findProgressBySectionId (sectionId:string, userId:string): Promise<Result<OdmProgressEntity>>;
    findUserCountInCourse (courseId:string): Promise<Result<number>>;
    findAllStartedCourses (userId:string, pagination:PaginationDto): Promise<Result<OdmProgressEntity[]>>;

    findLatestProgress (userId:string): Promise<Result<OdmProgressEntity>>;
    getTotalViewtime (userId:string): Promise<Result<number>>;
}