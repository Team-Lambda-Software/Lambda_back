import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { GetTrainerProfileServiceEntryDto } from "../../dto/parameters/get-trainer-profile-service-entry.dto";
import { GetTrainerProfileServiceResponseDto } from "../../dto/responses/get-trainer-profile-service-response.dto";
import { Result } from "src/common/Domain/result-handler/Result";
import { ITrainerRepository } from "src/trainer/domain/repositories/trainer-repository.interface";
import { Trainer } from "src/trainer/domain/trainer";
//Couple service to Course,Blog repositories
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { TrainerLocation } from "src/trainer/domain/value-objects/trainer-location";

export class GetTrainerProfileApplicationService implements IApplicationService<GetTrainerProfileServiceEntryDto, GetTrainerProfileServiceResponseDto>
{
    private readonly trainerRepository: ITrainerRepository;
    //unused According to the specifications of the common API, this data is not used when requesting a trainer
    // private readonly blogRepository: IBlogRepository;
    // private readonly courseRepository: ICourseRepository;

    constructor (trainerRepository: ITrainerRepository)
    {
        this.trainerRepository = trainerRepository;
    }

    async execute(data: GetTrainerProfileServiceEntryDto):Promise<Result<GetTrainerProfileServiceResponseDto>>
    {
        const resultTrainer = await this.trainerRepository.findTrainerById(data.trainerId);
        if (!resultTrainer.isSuccess())
        {
            return Result.fail<GetTrainerProfileServiceResponseDto>( resultTrainer.Error, resultTrainer.StatusCode, resultTrainer.Message );
        }
        const trainer = resultTrainer.Value;

        const resultCount = await this.trainerRepository.getFollowerCount(trainer.Id.Value);
        if (!resultCount.isSuccess())
        {
            return Result.fail<GetTrainerProfileServiceResponseDto>( resultCount.Error, resultCount.StatusCode, resultCount.Message );
        }
        const followerCount = resultCount.Value;

        const resultFollowFlag = await this.trainerRepository.checkIfFollowerExists(trainer.Id.Value, data.userId);
        if (!resultFollowFlag.isSuccess())
        {
            return Result.fail<GetTrainerProfileServiceResponseDto>( resultFollowFlag.Error, resultFollowFlag.StatusCode, resultFollowFlag.Message );
        }
        const doesUserFollow = resultFollowFlag.Value;

        const trainerName = trainer.Name.FirstName + " " + trainer.Name.FirstLastName + " " + trainer.Name.SecondLastName;
        const trainerId = trainer.Id.Value;
        let trainerLocation:string = "not available";
        let locationVO: TrainerLocation = trainer.Location;
        if (locationVO)
        {
            trainerLocation = trainer.Location.Latitude + ", " + trainer.Location.Longitude;
        }

        //. Same reason as above 'unused' flag
        // const resultCourses = await this.courseRepository.findAllTrainerCourses(trainer.Id, data.coursesPagination);
        // if (!resultCourses.isSuccess())
        // {
        //     return Result.fail<GetTrainerProfileServiceResponseDto>( resultCourses.Error, resultCourses.StatusCode, resultCourses.Message );
        // }
        // const courses = resultCourses.Value;

        // const resultBlogs = await this.blogRepository.findAllTrainerBlogs(trainer.Id, data.blogsPagination);
        // if (!resultBlogs.isSuccess())
        // {
        //     return Result.fail<GetTrainerProfileServiceResponseDto>( resultBlogs.Error, resultBlogs.StatusCode, resultBlogs.Message );
        // }
        // const blogs = resultBlogs.Value;

        return Result.success<GetTrainerProfileServiceResponseDto>({trainerName, trainerId, followerCount, doesUserFollow, trainerLocation}, 200)
    }

    get name():string
    {
        return this.constructor.name;
    }
}