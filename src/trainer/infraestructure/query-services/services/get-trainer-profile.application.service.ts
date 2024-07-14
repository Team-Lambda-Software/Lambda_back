import { IApplicationService } from 'src/common/Application/application-services/application-service.interface';
import { Result } from 'src/common/Domain/result-handler/Result';
//Couple service to Course,Blog repositories
import { GetTrainerProfileServiceEntryDto } from '../dto/parameters/get-trainer-profile-service-entry.dto';
import { GetTrainerProfileServiceResponseDto } from '../dto/response/get-trainer-profile-service-response.dto';
import { TrainerQueryRepository } from '../../repositories/trainer-query-repository.interface';

export class GetTrainerProfileApplicationService
  implements
    IApplicationService<
      GetTrainerProfileServiceEntryDto,
      GetTrainerProfileServiceResponseDto
    >
{
  private readonly trainerRepository: TrainerQueryRepository;
  //unused According to the specifications of the common API, this data is not used when requesting a trainer
  // private readonly blogRepository: IBlogRepository;
  // private readonly courseRepository: ICourseRepository;

  constructor(trainerRepository: TrainerQueryRepository) {
    this.trainerRepository = trainerRepository;
  }

  async execute(
    data: GetTrainerProfileServiceEntryDto,
  ): Promise<Result<GetTrainerProfileServiceResponseDto>> {
    const resultTrainer = await this.trainerRepository.findTrainerById(
      data.trainerId,
    );
    if (!resultTrainer.isSuccess()) {
      return Result.fail<GetTrainerProfileServiceResponseDto>(
        resultTrainer.Error,
        resultTrainer.StatusCode,
        resultTrainer.Message,
      );
    }
    const trainer = resultTrainer.Value;

    const resultCount = await this.trainerRepository.getFollowerCount(
      trainer.id,
    );
    if (!resultCount.isSuccess()) {
      return Result.fail<GetTrainerProfileServiceResponseDto>(
        resultCount.Error,
        resultCount.StatusCode,
        resultCount.Message,
      );
    }
    const followerCount = resultCount.Value;

    const resultFollowFlag = await this.trainerRepository.checkIfFollowerExists(
      trainer.id,
      data.userId,
    );
    if (!resultFollowFlag.isSuccess()) {
      return Result.fail<GetTrainerProfileServiceResponseDto>(
        resultFollowFlag.Error,
        resultFollowFlag.StatusCode,
        resultFollowFlag.Message,
      );
    }
    const doesUserFollow = resultFollowFlag.Value;

    const trainerName =
      trainer.first_name +
      ' ' +
      trainer.first_last_name +
      ' ' +
      trainer.second_last_name;
    const trainerId = trainer.id;
    let trainerLocation: string = null;
    if (
      trainer.latitude != 'null' &&
      trainer.longitude != 'null' &&
      trainer.latitude &&
      trainer.longitude
    ) {
      trainerLocation = trainer.latitude + ', ' + trainer.longitude;
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

    return Result.success<GetTrainerProfileServiceResponseDto>(
      {
        trainerName,
        trainerId,
        followerCount,
        doesUserFollow,
        trainerLocation,
      },
      200,
    );
  }

  get name(): string {
    return this.constructor.name;
  }
}
