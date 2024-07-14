import { IApplicationService } from 'src/common/Application/application-services/application-service.interface';
import { Result } from 'src/common/Domain/result-handler/Result';
import { GetManyTrainersServiceEntryDto } from '../dto/parameters/get-many-trainers-service-entry.dto';
import { GetManyTrainersServiceResponseDto } from '../dto/response/get-many-trainers-service-response.dto';
import { TrainerQueryRepository } from '../../repositories/trainer-query-repository.interface';

export class GetAllFollowedTrainersApplicationService
  implements
    IApplicationService<
      GetManyTrainersServiceEntryDto,
      GetManyTrainersServiceResponseDto
    >
{
  private readonly trainerRepository: TrainerQueryRepository;

  constructor(trainerRepository: TrainerQueryRepository) {
    this.trainerRepository = trainerRepository;
  }

  async execute(
    data: GetManyTrainersServiceEntryDto,
  ): Promise<Result<GetManyTrainersServiceResponseDto>> {
    const trainersResult = await this.trainerRepository.findTrainersByFollower(
      data.userId,
      data.pagination,
    );
    if (!trainersResult.isSuccess()) {
      return Result.fail<GetManyTrainersServiceResponseDto>(
        trainersResult.Error,
        trainersResult.StatusCode,
        trainersResult.Message,
      );
    }
    const trainers = trainersResult.Value;

    let trainersResponse: GetManyTrainersServiceResponseDto = { trainers: [] };
    for (const trainer of trainers) {
      const trainerId = trainer.id;

      const trainerName: string =
        trainer.first_name +
        ' ' +
        trainer.first_last_name +
        ' ' +
        trainer.second_last_name;

      let trainerLocation: string = null;
      if (
        trainer.latitude != 'null' &&
        trainer.longitude != 'null' &&
        trainer.latitude &&
        trainer.longitude
      ) {
        trainerLocation = trainer.latitude + ', ' + trainer.longitude;
      }

      const resultCount = await this.trainerRepository.getFollowerCount(
        trainer.id,
      );
      if (!resultCount.isSuccess()) {
        return Result.fail<GetManyTrainersServiceResponseDto>(
          resultCount.Error,
          resultCount.StatusCode,
          resultCount.Message,
        );
      }
      const followerCount = resultCount.Value;

      const trainerFollowers = trainer.followers;
      let doesUserFollow: boolean = false;
      for (let follower of trainerFollowers) {
        if (follower.id == data.userId) {
          doesUserFollow = true;
          break;
        }
      }

      const trainerResponse = {
        id: trainerId,
        name: trainerName,
        location: trainerLocation,
        followerCount: followerCount,
        doesUserFollow: doesUserFollow,
      };
      trainersResponse.trainers.push(trainerResponse);
    }

    return Result.success<GetManyTrainersServiceResponseDto>(
      trainersResponse,
      200,
    );
  }

  get name(): string {
    return this.constructor.name;
  }
}
