/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UpdateUserProfileInfraService } from "src/user/infraestructure/services/update-user-profile-infra.service"
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { EncryptorBcryptMock } from "test/common/other-mocks/encryptor.mock"
import { FileUploaderMock } from "test/common/other-mocks/file-uploader.mock"
import { UuidGeneratorMock } from "test/common/other-mocks/uuid-generator.mock"
import { OdmAccountMockRepository } from "test/common/repository-mocks/account-query-repository.mock"
import { OrmAccountMockRepository } from "test/common/repository-mocks/account-repository.mock"
import { OrmInfraUserRepositoryMock } from "test/common/repository-mocks/ormUser-repository.mock"

/* eslint-disable prettier/prettier */
describe('UpdateUserProfileInfraService',() => {

    let infraUserRepository: OrmInfraUserRepositoryMock
    let nosqlRepository: OdmAccountMockRepository
    let encryptor: EncryptorBcryptMock
    let fileUploader: FileUploaderMock
    let idGenerator: UuidGeneratorMock
    let service: UpdateUserProfileInfraService

    beforeEach(() => {
        infraUserRepository = new OrmInfraUserRepositoryMock()
        nosqlRepository = new OdmAccountMockRepository()
        encryptor = new EncryptorBcryptMock()
        fileUploader = new FileUploaderMock()
        idGenerator = new UuidGeneratorMock()
        service = new UpdateUserProfileInfraService(
            infraUserRepository,
            nosqlRepository,
            idGenerator,
            encryptor,
            fileUploader
        )
    })

    it('should update ORM user correctly', async () =>{

        const readModelObjectMother = new ReadModelObjectMother();

        const user = await UserObjectMother.createOrmUser()
        await infraUserRepository.saveOrmUser(user)
        
        const odmUser = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        await nosqlRepository.saveUser(odmUser)

        const updateEntry = await UserObjectMother.updateInfraEntryValid(user.id);

        const result = await service.execute(updateEntry)
        
        expect(result.isSuccess()).toBeTruthy()

    })

    it('user not existed in the database',async () => {

        const user = await UserObjectMother.createOrmUser()

        const updateEntry = await UserObjectMother.updateInfraEntryValid(user.id);

        const result = await service.execute(updateEntry)

        expect(result.isSuccess()).toBeFalsy()
    })

})