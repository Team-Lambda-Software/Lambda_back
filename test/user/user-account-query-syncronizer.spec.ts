/* eslint-disable prettier/prettier */
import { InfraUserQuerySynchronizer } from "src/user/infraestructure/query-synchronizer/user-infra-query-synchronizer";
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model";
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother";
import { UserQueryRepositoryMock } from "test/common/repository-mocks/user-query-repository.mock";

/* eslint-disable prettier/prettier */
describe('UserAccountQuerySynchronizer', () => {

    it('should save a new ORM user in the query database', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const userRepository = new UserQueryRepositoryMock();
        const userQuerySynchronizer = new InfraUserQuerySynchronizer(
            userRepository,
            readModelObjectMother.getUserModel()
        );

        const user = await UserObjectMother.createOrmUser()

        const result = await userQuerySynchronizer.execute(user)

        expect(result.isSuccess()).toBeTruthy()
    })
})