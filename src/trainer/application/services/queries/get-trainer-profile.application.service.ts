import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { GetTrainerProfileServiceEntryDto } from "../../dto/parameters/get-trainer-profile-service-entry.dto";
import { GetTrainerProfileServiceResponseDto } from "../../dto/responses/get-trainer-profile-service-response.dto";
import { Result } from "src/common/Domain/result-handler/Result";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Trainer } from "src/trainer/domain/trainer";
//Couple service to Course,Blog repositories
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";

export class GetTrainerProfileApplicationService implements IApplicationService<GetTrainerProfileServiceEntryDto, GetTrainerProfileServiceResponseDto>
{
    private readonly trainerRepository: ITrainerRepository;
    private readonly blogRepository: IBlogRepository;
    private readonly courseRepository: ICourseRepository;

    constructor (trainerRepository: ITrainerRepository, blogRepository: IBlogRepository, courseRepository: ICourseRepository)
    {
        this.trainerRepository = trainerRepository;
        this.blogRepository = blogRepository;
        this.courseRepository = courseRepository;
    }

    async execute(data: GetTrainerProfileServiceEntryDto):Promise<Result<GetTrainerProfileServiceResponseDto>>
    {
        const resultTrainer = await this.trainerRepository.findTrainerById(data.trainerId);
        if (!resultTrainer.isSuccess())
        {
            return Result.fail<GetTrainerProfileServiceResponseDto>( resultTrainer.Error, resultTrainer.StatusCode, resultTrainer.Message );
        }
        const trainer = resultTrainer.Value;

        const resultCount = await this.trainerRepository.getFollowerCount(trainer.Id);
        if (!resultCount.isSuccess())
        {
            return Result.fail<GetTrainerProfileServiceResponseDto>( resultCount.Error, resultCount.StatusCode, resultCount.Message );
        }
        const followerCount = resultCount.Value;

        const resultCourses = await this.courseRepository.findAllTrainerCourses(trainer.Id, data.coursesPagination);
        if (!resultCourses.isSuccess())
        {
            return Result.fail<GetTrainerProfileServiceResponseDto>( resultCourses.Error, resultCourses.StatusCode, resultCourses.Message );
        }
        const courses = resultCourses.Value;

        const resultBlogs = await this.blogRepository.findAllTrainerBlogs(trainer.Id, data.blogsPagination);
        if (!resultBlogs.isSuccess())
        {
            return Result.fail<GetTrainerProfileServiceResponseDto>( resultBlogs.Error, resultBlogs.StatusCode, resultBlogs.Message );
        }
        const blogs = resultBlogs.Value;

        return Result.success<GetTrainerProfileServiceResponseDto>({trainer, followerCount, courses, blogs}, 200)
    }

    get name():string
    {
        return this.constructor.name;
    }
}