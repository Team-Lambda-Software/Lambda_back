import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { GetAllStartedCoursesEntryDto } from "../../dto/parameters/get-all-started-courses-entry.dto";
import { GetAllStartedCoursesResponseDto } from "../../dto/responses/get-all-started-courses-response.dto";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { Course } from "src/course/domain/course";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface";


export class GetAllStartedCoursesApplicationService implements IApplicationService<GetAllStartedCoursesEntryDto, GetAllStartedCoursesResponseDto>
{
    private readonly progressRepository: IProgressCourseRepository;
    private readonly courseRepository: ICourseRepository;
    private readonly categoryRepository: ICategoryRepository;

    constructor ( progressRepository:IProgressCourseRepository, courseRepository:ICourseRepository, categoryRepository:ICategoryRepository )
    {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
    }

    async execute(data:GetAllStartedCoursesEntryDto): Promise<Result<GetAllStartedCoursesResponseDto>>
    {
        const arrayProgressResult = await this.progressRepository.findAllStartedCourses(data.userId, data.pagination);
        if (!arrayProgressResult.isSuccess())
        {
            return Result.fail<GetAllStartedCoursesResponseDto>(arrayProgressResult.Error, arrayProgressResult.StatusCode, arrayProgressResult.Message);
        }
        const arrayProgress = arrayProgressResult.Value;

        let arrayResponseData:{course:Course, categoryName:string, progress:ProgressCourse}[];
        for (let progress of arrayProgress)
        {
            const courseResult = await this.courseRepository.findCourseById(progress.CourseId);
            if (!courseResult.isSuccess())
            {
                return Result.fail<GetAllStartedCoursesResponseDto>(courseResult.Error, courseResult.StatusCode, courseResult.Message);
            }
            const course = courseResult.Value;

            const categoryResult = await this.categoryRepository.findCategoryById(course.CategoryId);
            if (!categoryResult.isSuccess())
            {
                return Result.fail<GetAllStartedCoursesResponseDto>(categoryResult.Error, categoryResult.StatusCode, categoryResult.Message);
            }
            const categoryName = categoryResult.Value.Name;

            arrayResponseData.push({course: courseResult.Value, categoryName: categoryName, progress: progress});
        }

        let returnDataArray:Array< { id: string, title: string, image:string, date: Date, category: string, trainerName: string, completionPercent: number } > = [];
        for (let response of arrayResponseData)
        {
            //? Is CategoryId sufficient? Or is the category's name desired?
            const returnData = { 
                id: response.progress.CourseId, 
                title: response.course.Name, 
                image: response.course.Image,
                date: response.course.Date,
                category: response.categoryName, 
                trainerName: response.course.Trainer.FirstName + " " + response.course.Trainer.FirstLastName + " " + response.course.Trainer.SecondLastName,
                completionPercent: response.progress.CompletionPercent
            };
            returnDataArray.push(returnData);
        }
        return Result.success<GetAllStartedCoursesResponseDto>( {courses: returnDataArray}, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}