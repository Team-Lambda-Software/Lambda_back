import { TrainerUnFollowQuerySyncronizer } from "src/trainer/infraestructure/query-synchronizers/trainer-unfollow-query-synchronizer"
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model"
import { TrainerDomainEventObjectMother } from "test/common/objects-mothers/trainer-domain-event.object-mother"
import { TrainerObjectMother } from "test/common/objects-mothers/trainer.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { TrainerQueryRepositoryMock } from "test/common/repository-mocks/trainer-query-repository.mock"
import { UserQueryRepositoryMock } from "test/common/repository-mocks/user-query-repository.mock"





describe('UnfollowTrainerQuerySynchronizer', () => {

    it ('should unfollow a trainer', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const trainer = await new TrainerObjectMother(readModelObjectMother.getTrainerModel()).createOdmTrainer();
        const trainerRepositoryMock = new TrainerQueryRepositoryMock();
        trainerRepositoryMock.saveTrainer(trainer);

        const synchronizer = new TrainerUnFollowQuerySyncronizer(
            trainerRepositoryMock
        ) 

        const event = TrainerDomainEventObjectMother.UnfollowTrainerDomainEvent(trainer.id, user.id)

        const result = await synchronizer.execute(event)
        
        expect(result.isSuccess()).toBeTruthy()
    })

})