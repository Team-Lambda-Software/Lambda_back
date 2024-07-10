/* eslint-disable prettier/prettier */
import { UpdateUserProfileAplicationService } from "src/user/application/services/command/update-user-profile.application.service"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { EventHandlerMock } from "test/common/other-mocks/event-handler.mock"
import { UserMockRepository } from "test/common/repository-mocks/user-repository.mock"

/* eslint-disable prettier/prettier */
describe('UpdateUserProfileApplicationService', () => {
   
    it('should update user correctly',async () => {

        const eventHandler = new EventHandlerMock()
        const userRepository = new UserMockRepository()
        const user = await UserObjectMother.createNormalUser()

        await userRepository.saveUserAggregate(user)

        const updateEntry = await UserObjectMother.updateEntryValid(user.Id);

        const service = new UpdateUserProfileAplicationService(
            userRepository,
            eventHandler
        )

        const result = await service.execute(updateEntry)

        expect(result.isSuccess()).toBeTruthy()
    })

    it('email invalid',async () => {

        const eventHandler = new EventHandlerMock()
        const userRepository = new UserMockRepository()
        const user = await UserObjectMother.createNormalUser()

        await userRepository.saveUserAggregate(user)

        const updateEntry = await UserObjectMother.updateEntryInvalidEmail(user.Id);

        const service = new UpdateUserProfileAplicationService(
            userRepository,
            eventHandler
        )

        const result = await service.execute(updateEntry)

        expect(result.isSuccess()).toBeFalsy()
    })

    it('name invalid',async () => {
        const eventHandler = new EventHandlerMock()
        const userRepository = new UserMockRepository()
        const user = await UserObjectMother.createNormalUser()

        await userRepository.saveUserAggregate(user)

        const updateEntry = await UserObjectMother.updateEntryInvalidName(user.Id);

        const service = new UpdateUserProfileAplicationService(
            userRepository,
            eventHandler
        )

        const result = await service.execute(updateEntry)

        expect(result.isSuccess()).toBeFalsy()
    })

    it('phone invalid',async () => {

        const eventHandler = new EventHandlerMock()
        const userRepository = new UserMockRepository()
        const user = await UserObjectMother.createNormalUser()

        await userRepository.saveUserAggregate(user)

        const updateEntry = await UserObjectMother.updateEntryInvalidPhone(user.Id);
        
        const service = new UpdateUserProfileAplicationService(
            userRepository,
            eventHandler
        )

        const result = await service.execute(updateEntry)

        expect(result.isSuccess()).toBeFalsy()
    })

    it('user not existed in the database',async () => {

        const eventHandler = new EventHandlerMock()
        const userRepository = new UserMockRepository()
        const user = await UserObjectMother.createNormalUser()

        const updateEntry = await UserObjectMother.updateEntryValid(user.Id);

        const service = new UpdateUserProfileAplicationService(
            userRepository,
            eventHandler
        )

        const result = await service.execute(updateEntry)

        expect(result.isSuccess()).toBeFalsy()
    })

})