import { TogggleTrainerFollowServiceEntryDto } from "src/trainer/application/dto/parameters/toggle-trainer-follow-service-entry.dto"
import { FollowTrainerApplicationService } from "src/trainer/application/services/commands/follow-trainer.application.service"
import { TrainerObjectMother } from "test/common/objects-mothers/trainer.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { EventHandlerMock } from "test/common/other-mocks/event-handler.mock"
import { TrainerMockRepository } from "test/common/repository-mocks/trainer-repository.mock"
import { UserMockRepository } from "test/common/repository-mocks/user-repository.mock"



describe ('Follow Trainer', () => {

    it ('should follow a trainer', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);

        const service = new FollowTrainerApplicationService(
            trainerRepositoryMock,
            new EventHandlerMock()
        )

        const entry :TogggleTrainerFollowServiceEntryDto = {
            trainer: trainer,
            userId: user.Id.Id
        }

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()
    })

    it ('should fail if user already follows the trainer', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);
        trainerRepositoryMock.followTrainer(trainer.Id.Value, user.Id.Id);
        const service = new FollowTrainerApplicationService(
            trainerRepositoryMock,
            new EventHandlerMock()
        )

        const entry :TogggleTrainerFollowServiceEntryDto = {
            trainer: trainer,
            userId: user.Id.Id
        }

        await service.execute(entry)

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()
    })

})