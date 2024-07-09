/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { UpdateUserProfileAplicationService } from "src/user/application/services/command/update-user-profile.application.service";
import { UserQuerySynchronizer } from "src/user/infraestructure/query-synchronizer/user-query-synchronizer";
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model";
import { UserDomainEventObjectMother } from "test/common/objects-mothers/user-domain-event.objec-mother";
import { UserQueryRepositoryMock } from "test/common/repository-mocks/user-query-repository.mock";

/* eslint-disable prettier/prettier */
describe('UserQuerySynchronizer', () => {
    
    it('should save a new DDD user in the query database', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const userRepository = new UserQueryRepositoryMock();
        const userQuerySynchronizer = new UserQuerySynchronizer(
            userRepository,
            readModelObjectMother.getUserModel()
        );
        const user = UserDomainEventObjectMother.createUserCreatedEvent();
        const result = await userQuerySynchronizer.execute(user)
        expect(result.isSuccess()).toBeTruthy()
    })

    it('should save a DDD user with new email in the query database', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const userRepository = new UserQueryRepositoryMock();
        const userQuerySynchronizer = new UserQuerySynchronizer(
            userRepository,
            readModelObjectMother.getUserModel()
        );
        const user = UserDomainEventObjectMother.createUserEmailModifiedEvent();
        const result = await userQuerySynchronizer.execute(user)
        expect(result.isSuccess()).toBeTruthy()
    })

    it('should save a DDD user with new name in the query database', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const userRepository = new UserQueryRepositoryMock();
        const userQuerySynchronizer = new UserQuerySynchronizer(
            userRepository,
            readModelObjectMother.getUserModel()
        );
        const user = UserDomainEventObjectMother.createUserNameModifiedEvent();
        const result = await userQuerySynchronizer.execute(user)
        expect(result.isSuccess()).toBeTruthy()
    })

    it('should save a DDD user with new phone in the query database', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const userRepository = new UserQueryRepositoryMock();
        const userQuerySynchronizer = new UserQuerySynchronizer(
            userRepository,
            readModelObjectMother.getUserModel()
        );
        const user = UserDomainEventObjectMother.createUserPhoneModifiedEvent();
        const result = await userQuerySynchronizer.execute(user)
        expect(result.isSuccess()).toBeTruthy()
    })
})