import { IApplicationService } from 'src/common/Application/application-services/application-service.interface';
import { CreateTrainerServiceEntryDto } from '../../dto/parameters/create-trainer-service-entry.dto';
import { Result } from 'src/common/Domain/result-handler/Result';
import { ITrainerRepository } from 'src/trainer/domain/repositories/trainer-repository.interface';
import { IdGenerator } from 'src/common/Application/Id-generator/id-generator.interface';
import { Trainer } from 'src/trainer/domain/trainer';
import { TrainerId } from 'src/trainer/domain/value-objects/trainer-id';
import { TrainerName } from 'src/trainer/domain/value-objects/trainer-name';
import { TrainerEmail } from 'src/trainer/domain/value-objects/trainer-email';
import { TrainerPhone } from 'src/trainer/domain/value-objects/trainer-phone';
import { TrainerFollowers } from 'src/trainer/domain/value-objects/trainer-followers';
import { TrainerLocation } from 'src/trainer/domain/value-objects/trainer-location';
import { IEventHandler } from 'src/common/Application/event-handler/event-handler.interface';

export class CreateTrainerApplicationService
  implements IApplicationService<CreateTrainerServiceEntryDto, string>
{
  private readonly trainerRepository: ITrainerRepository;
  private readonly idGenerator: IdGenerator<string>;
  private readonly eventHandler: IEventHandler;

  constructor(
    trainerRepository: ITrainerRepository,
    idGenerator: IdGenerator<string>,
    eventHandler: IEventHandler,
  ) {
    this.trainerRepository = trainerRepository;
    this.idGenerator = idGenerator;
    this.eventHandler = eventHandler;
  }

  async execute(data: CreateTrainerServiceEntryDto): Promise<Result<string>> {
    const trainer = await this.trainerRepository.findTrainerByEmail(data.email);
    if (trainer.isSuccess()) {
      return Result.fail<string>(
        new Error('Trainer already exists'),
        409,
        'Trainer already exists',
      );
    }
    const newTrainer = Trainer.create(
      TrainerId.create(await this.idGenerator.generateId()),
      TrainerName.create(
        data.firstName,
        data.firstLastName,
        data.secondLastName,
      ),
      TrainerEmail.create(data.email),
      TrainerPhone.create(data.phone),
      TrainerFollowers.create([]),
    );
    const result = await this.trainerRepository.saveTrainer(newTrainer);
    if (!result.isSuccess()) {
      return Result.fail<string>(
        result.Error,
        result.StatusCode,
        result.Message,
      );
    }
    await this.eventHandler.publish(newTrainer.pullEvents());
    return Result.success<string>('entrenador guardado', 201);
  }
  get name(): string {
    return 'CreateTrainerApplicationService';
  }
}
