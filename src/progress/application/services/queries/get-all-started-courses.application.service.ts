import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { GetAllStartedCoursesEntryDto } from "../../dto/parameters/get-all-started-courses-entry.dto";
import { GetAllStartedCoursesResponseDto } from "../../dto/responses/get-all-started-courses-response.dto";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";
import { Course } from "src/course/domain/course";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";
import { ICategoryRepository } from "src/categories/domain/repositories/category-repository.interface";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Trainer } from "src/trainer/domain/trainer";


export class GetAllStartedCoursesApplicationService implements IApplicationService<GetAllStartedCoursesEntryDto, GetAllStartedCoursesResponseDto>
{
    private readonly progressRepository: IProgressCourseRepository;
    private readonly courseRepository: ICourseRepository;
    private readonly categoryRepository: ICategoryRepository;
    private readonly trainerRepository: ITrainerRepository;

    constructor ( progressRepository:IProgressCourseRepository, courseRepository:ICourseRepository, categoryRepository:ICategoryRepository, trainerRepository:ITrainerRepository )
    {
        this.progressRepository = progressRepository;
        this.courseRepository = courseRepository;
        this.categoryRepository = categoryRepository;
        this.trainerRepository = trainerRepository;
    }

    async execute(data:GetAllStartedCoursesEntryDto): Promise<Result<GetAllStartedCoursesResponseDto>>
    {
        data.pagination.page = data.pagination.page * data.pagination.perPage - data.pagination.perPage
        const arrayProgressResult = await this.progressRepository.findAllStartedCourses(data.userId, data.pagination);
        if (!arrayProgressResult.isSuccess())
        {
            return Result.fail<GetAllStartedCoursesResponseDto>(arrayProgressResult.Error, arrayProgressResult.StatusCode, arrayProgressResult.Message);
        }
        const arrayProgress = arrayProgressResult.Value;

        let arrayResponseData:{course:Course, categoryName:string, trainerName:string, progress:ProgressCourse}[] = [];
        for (let progress of arrayProgress)
        {
            const courseResult = await this.courseRepository.findCourseById(progress.CourseId);
            if (!courseResult.isSuccess())
            {
                return Result.fail<GetAllStartedCoursesResponseDto>(courseResult.Error, courseResult.StatusCode, courseResult.Message);
            }
            const course = courseResult.Value;

            const categoryResult = await this.categoryRepository.findCategoryById(course.CategoryId.Value);
            if (!categoryResult.isSuccess())
            {
                return Result.fail<GetAllStartedCoursesResponseDto>(categoryResult.Error, categoryResult.StatusCode, categoryResult.Message);
            }
            const categoryName = categoryResult.Value.Name;

            const trainerResult = await this.trainerRepository.findTrainerById(course.TrainerId.Value);
            if (!trainerResult.isSuccess())
            {
                return Result.fail<GetAllStartedCoursesResponseDto>(trainerResult.Error, trainerResult.StatusCode, trainerResult.Message);
            }
            const trainer:Trainer = trainerResult.Value;
            const trainerNameVO = trainer.Name;
            const trainerName = trainerNameVO.FirstName + " " + trainerNameVO.FirstLastName + " " + trainerNameVO.SecondLastName;

            arrayResponseData.push({course: courseResult.Value, categoryName: categoryName.Value, trainerName:trainerName, progress: progress});
        }
        //! make this a dto
        let returnDataArray:Array< { id: string, title: string, image:string, date: Date, category: string, trainerName: string, completionPercent: number } > = [];
        for (let response of arrayResponseData)
        {
            const returnData = { 
                id: response.progress.CourseId, 
                title: response.course.Name.Value, 
                image: response.course.Image.Value,
                date: response.course.Date.Value,
                category: response.categoryName, 
                trainerName: response.trainerName,
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