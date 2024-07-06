import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { GetTrainerServiceEntryDto } from "../dto/parameters/get-trainer-service-entry.dto";
import { GetTrainerServiceResponseDto } from "../dto/response/get-trainer-service-response.dto";
import { TrainerQueryRepository } from "../../repositories/trainer-query-repository.interface";
import { Result } from "src/common/Domain/result-handler/Result";

export class GetTrainerService implements IApplicationService<GetTrainerServiceEntryDto, GetTrainerServiceResponseDto>
{
    private readonly trainerRepository: TrainerQueryRepository

    constructor ( trainerRepository: TrainerQueryRepository )
    {
        this.trainerRepository = trainerRepository;
    }
    
    async execute(data: GetTrainerServiceEntryDto): Promise<Result<GetTrainerServiceResponseDto>> {
        const resultTrainer = await this.trainerRepository.findTrainerById( data.trainerId );
        if ( !resultTrainer.isSuccess() )
        {
            return Result.fail<GetTrainerServiceResponseDto>( resultTrainer.Error, resultTrainer.StatusCode, resultTrainer.Message );
        }
        const trainer = resultTrainer.Value

        let trainerLocation: string = "no disponible";
        if ( trainer.latitude != "null" && trainer.longitude != "null" ) { trainerLocation = trainer.latitude + ", " + trainer.longitude; }

        //to-do Construct all necessary data for this to be really functional
        let responseTrainer: GetTrainerServiceResponseDto = {
            trainerName: trainer.first_name + " " + trainer.first_last_name + " " + trainer.second_last_name,
            trainerId: trainer.id,
            followerCount: 0,
            doesUserFollow: false,
            trainerLocation: trainerLocation
        }
        return Result.success<GetTrainerServiceResponseDto>( responseTrainer, 200 );
    }

    get name():string
    {
        return this.constructor.name;
    }
}