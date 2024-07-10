import { SignUpEntryDto } from "src/auth/application/dto/entry/sign-up-entry.application.dto"
import { SignUpUserApplicationService } from "src/auth/application/services/sign-up-user-service.application.service"
import { EventHandlerMock } from "test/common/other-mocks/event-handler.mock"
import { UuidGeneratorMock } from "test/common/other-mocks/uuid-generator.mock"
import { UserMockRepository } from "test/common/repository-mocks/user-repository.mock"

describe('Sign up a User', () => {
    
    it('should sign up a user', async () => {
        const entry: SignUpEntryDto = {
            userId: 'none',
            email: 'pedroescalona@gmail.com',
            name: 'Pedro Escalona',
            phone: '32324985321',
        }
        const service = new SignUpUserApplicationService(
            new EventHandlerMock(),
            new UserMockRepository(),
            new UuidGeneratorMock(),
        )
        const result = await service.execute(entry)
        expect(result.isSuccess())           
    })

    it('should fail if no name', async () => {
        const entry: SignUpEntryDto = {
            userId: 'none',
            email: 'pedroescalona@gmail.com',
            name: '',
            phone: '32324985321',
        }
        const service = new SignUpUserApplicationService(
            new EventHandlerMock(),
            new UserMockRepository(),
            new UuidGeneratorMock(),
        )
        try {
            await service.execute(entry)
        } catch(error) {
            expect(error.message).toEqual('El nombre no puede estar vacío')
        }
    })

    
    it('should fail if no email', async () => {
        const entry: SignUpEntryDto = {
            userId: 'none',
            email: '',
            name: 'Pedro Escalona',
            phone: '32324985321',
        }
        const service = new SignUpUserApplicationService(
            new EventHandlerMock(),
            new UserMockRepository(),
            new UuidGeneratorMock(),
        )
        const result = await service.execute(entry)
        expect(result.isSuccess()).toBeFalsy()
        
    })

    it('should fail if no phone', async () => {
        const entry: SignUpEntryDto = {
            userId: 'none',
            email: 'pedroescalona@gmail.com',
            name: 'Pedro Escalona',
            phone: '',
        }
        const service = new SignUpUserApplicationService(
            new EventHandlerMock(),
            new UserMockRepository(),
            new UuidGeneratorMock(),
        )
        const result = await service.execute(entry)
        expect(result.isSuccess()).toBeFalsy()
        
    })

    it('should fail if length phone is minor than 11', async () => {
        const entry: SignUpEntryDto = {
            userId: 'none',
            email: 'pedroescalona@gmail.com',
            name: 'Pedro Escalona',
            phone: '124124',
        }
        const service = new SignUpUserApplicationService(
            new EventHandlerMock(),
            new UserMockRepository(),
            new UuidGeneratorMock(),
        )
        const result = await service.execute(entry)
        expect(result.isSuccess()).toBeFalsy()
        
    })


    it('should fail if format email is incorrect', async () => {
        const entry: SignUpEntryDto = {
            userId: 'none',
            email: 'pedroescalona',
            name: 'Pedro Escalona',
            phone: '32324985321',
        }
        const service = new SignUpUserApplicationService(
            new EventHandlerMock(),
            new UserMockRepository(),
            new UuidGeneratorMock(),
        )
        const result = await service.execute(entry)
        expect(result.isSuccess()).toBeFalsy()
    })

    it('should fail if format name is incorrect', async () => {
        const entry: SignUpEntryDto = {
            userId: 'none',
            email: 'pedroescalona',
            name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            phone: '32324985321',
        }
        const service = new SignUpUserApplicationService(
            new EventHandlerMock(),
            new UserMockRepository(),
            new UuidGeneratorMock(),
        )
        const result = await service.execute(entry)
        expect(result.isSuccess()).toBeFalsy()
        //expect(result.Error).toEqual('El nombre aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa no es valido por la cantidad de caracteres')
        
    })

})