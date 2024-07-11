import { Model } from "mongoose";
import { ProgressQueryRepository } from "../progress-query-repository.interface";
import { OdmProgressEntity } from "../../entities/odm-entities/odm-progress.entity";
import { Result } from "src/common/Domain/result-handler/Result";
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto";

export class OdmProgressRepository implements ProgressQueryRepository {

    private readonly progressModel: Model<OdmProgressEntity>
    constructor ( progressModel:Model<OdmProgressEntity> )
    {
        this.progressModel = progressModel;
    }

    async resetSectionProgress ( sectionId: string, userId: string ): Promise<Result<string>>
    {
        try
        {
            const progress = await this.progressModel.findOne( {'section_progress.section_id': sectionId, 'user_id': userId} );
            if (progress == null)
            {
                return Result.fail<string>(new Error("Progress does not exist"), 404, "Progress does not exist");
            }
            const sec = progress.section_progress.find( (section) => section.section_id == sectionId );
            sec.completed = false;
            sec.completion_percent = 0;
            sec.video_second = 0;
            progress.section_progress = progress.section_progress.map( (section) => section.section_id == sectionId ? sec : section );
            await this.progressModel.updateOne( {'section_progress.section_id': sectionId, 'user_id': userId}, progress );
            return Result.success<string>("Section progress reset successfully", 200);
        }
        catch (error)
        {
            return Result.fail<string>(error, 500, error.message);
        }
    }

    async changeCourseCompletitionPercent ( courseId: string, userId: string, completionPercent: number ): Promise<Result<string>>
    {
        try
        {
            const progress = await this.progressModel.findOne( {course_id: courseId, user_id: userId} );
            if (progress == null)
            {
                return Result.fail<string>(new Error("Progress does not exist"), 404, "Progress does not exist");
            }
            progress.completion_percent = completionPercent;
            progress.completed = completionPercent == 100;
            await this.progressModel.updateOne( {course_id: courseId, user_id: userId}, progress );
            return Result.success<string>("Course completion percent updated successfully", 200);
        }
        catch (error)
        {
            return Result.fail<string>(error, 500, error.message);
        }
    }
    async addSectionProgressToCourse ( section: { progress_id: string; section_id: string; completed: boolean; completion_percent: number; video_second: number }, progressId: string ): Promise<Result<string>>
    {
        try
        {
            const progress = await this.progressModel.findOne( {progress_id: progressId} );
            if (progress == null)
            {
                return Result.fail<string>(new Error("Progress does not exist"), 404, "Progress does not exist");
            }
            const sectionProgress = {
                progress_id: section.progress_id,
                section_id: section.section_id,
                completed: section.completed,
                completion_percent: section.completion_percent,
                video_second: section.video_second
            }
            progress.section_progress.push( sectionProgress );
            await this.progressModel.updateOne( {progress_id: progressId}, progress );
            return Result.success<string>("Section progress added successfully", 200);
        }
        catch (error)
        {
            return Result.fail<string>(error, 500, error.message);
        }
    }
    async findAllProgressByCourseId ( courseId: string ): Promise<Result<OdmProgressEntity[]>>
    {
        try{
            const progresses = await this.progressModel.find( {course_id: courseId} );
            return Result.success<OdmProgressEntity[]>( progresses, 200 );
        }catch(error){
            return Result.fail<OdmProgressEntity[]>( error, 500, error.message );
        }
    }

    async saveProgress (progress:OdmProgressEntity): Promise<void>
    {
        await this.progressModel.create( progress );
    }

    async updateProgress (progress:OdmProgressEntity): Promise<Result<string>>
    {
        try
        {
            await this.progressModel.updateOne( {progress_id: progress.progress_id}, progress );
            return Result.success<string>( "Update successful", 200 );
        }
        catch (error)
        {
            return Result.fail<string>(error, 500, error.message);
        }
    }

    async findProgressByCourseId (courseId:string, userId:string): Promise<Result<OdmProgressEntity>>
    {
        try
        {
            const progress = await this.progressModel.findOne( {course_id:courseId, user_id:userId} );
            if (progress == null)
            {
                return Result.fail<OdmProgressEntity>(new Error("Progress does not exist"), 404, "Progress does not exist");
            }
            return Result.success<OdmProgressEntity>( progress, 200 );
        }
        catch (error)
        {
            return Result.fail<OdmProgressEntity>( error, 500, error.message );
        }
    }

    async findProgressBySectionId (sectionId:string, userId:string): Promise<Result<OdmProgressEntity>>
    {
        try
        {
            const progress = await this.progressModel.findOne( {'section_progress.section_id': sectionId, 'user_id': userId });
            if (progress == null)
            {
                return Result.fail<OdmProgressEntity>(new Error("Progress does not exist"), 404, "Progress does not exist");
            }
            return Result.success<OdmProgressEntity>( progress, 200 );
        }
        catch (error)
        {
            return Result.fail<OdmProgressEntity>( error, 500, error.message );
        }
    }

    async findUserCountInCourse (courseId:string): Promise<Result<number>>
    {
        try
        {
            const userCount = await this.progressModel.countDocuments( {'course_id': courseId} );
            return Result.success<number>( userCount, 200 );
        }
        catch (error)
        {
            return Result.fail<number>( error, 500, error.message );
        }
    }

    async findAllStartedCourses (userId:string, pagination:PaginationDto): Promise<Result<OdmProgressEntity[]>>
    {
        try
        {
            const {page, perPage} = pagination;
            const startedCourses = await this.progressModel.find( {'user_id': userId} ).skip((page-1)*perPage).limit(perPage).sort( {'last_seen_date':'desc'} );
            if ( startedCourses == null )
            {
                return Result.fail<OdmProgressEntity[]>(new Error("No progress found for the given user"), 404, "No progress found for the given user");
            }
            return Result.success<OdmProgressEntity[]>( startedCourses, 200 );
        }
        catch (error)
        {
            return Result.fail<OdmProgressEntity[]>( error, 500, error.message );
        }
    }

    async findLatestProgress (userId:string): Promise<Result<OdmProgressEntity>>
    {
        try
        {
            const latestProgress = await this.progressModel.find({'user_id':userId}).limit(1).sort({'last_seen_date':'desc'});
            if ( (latestProgress == null)||(latestProgress.length === 0) )
            {
                return Result.fail<OdmProgressEntity>(new Error("No progress found for the given user"), 404, "No progress found for the given user");
            }
            return Result.success<OdmProgressEntity>( latestProgress[0], 200 );
        }
        catch (error)
        {
            return Result.fail<OdmProgressEntity>( error, 500, error.message );
        }
    }

    async getTotalViewtime (userId:string): Promise<Result<number>>
    {
        try
        {
            const startedCourses = await this.progressModel.find( {'user_id': userId} );
            if (startedCourses == null)
            {
                return Result.success<number>( 0, 200 );
            }
            let viewtime:number = 0;
            for (let course of startedCourses)
            {
                for (let section of course.section_progress)
                {
                    viewtime += section.video_second;
                }
            }
            return Result.success<number>( viewtime, 200 );
        }
        catch (error)
        {
            return Result.fail<number>( error, 500, error.message );
        }
    }
}