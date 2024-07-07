/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { UserQuerySynchronizer } from "src/user/infraestructure/query-synchronizer/user-query-synchronizer";
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model";
import { UserDomainEventObjectMother } from "test/common/objects-mothers/UserDomainEventObjectMother";
import { UserQueryRepositoryMock } from "test/common/repository-mocks/user-query-repository.mock";

/* eslint-disable prettier/prettier */
describe('UserQuerySynchronizer', () => {
    it('should save a new user in the query database', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const userRepository = new UserQueryRepositoryMock();
        const userQuerySynchronizer = new UserQuerySynchronizer(
            userRepository,
            readModelObjectMother.getUserModel()
        );
        const user = UserDomainEventObjectMother.createUserCreatedEvent();

    })
})