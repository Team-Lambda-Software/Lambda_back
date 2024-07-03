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
        expect(result.isSuccess()).toBeTruthy()                
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
        try { await service.execute(entry) }
        catch (error){
            expect(error.message).toEqual('El nombre no puede estar vacío')
        }
        expect.assertions(1)
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
        try { await service.execute(entry) }
        catch (error){
            expect(error.message).toEqual('El email del usuario no puede estar vacio')
        }
        expect.assertions(1)
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
        try { await service.execute(entry) }
        catch (error){
            expect(error.message).toEqual('El telefono no puede estar vacío')
        }
        expect.assertions(1)
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
        try { await service.execute(entry) }
        catch (error){
            expect(error.message).toEqual('El telefono 124124 debe tener 11 digitos')
        }
        expect.assertions(1)
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
        try { await service.execute(entry) }
        catch (error){
            expect(error.message).toEqual('El email pedroescalona no es valido.')
        }
        expect.assertions(1)
    })

    it('should fail if format name is incorrect', async () => {
        const entry: SignUpEntryDto = {
            userId: 'none',
            email: 'pedroescalona',
            name: 'P*/ro Es$a$o4a',
            phone: '32324985321',
        }
        const service = new SignUpUserApplicationService(
            new EventHandlerMock(),
            new UserMockRepository(),
            new UuidGeneratorMock(),
        )
        try { await service.execute(entry) }
        catch (error){
            expect(error.message).toEqual('El nombre P*/ro Es$a$o4a no es valido')
        }
        expect.assertions(1)
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
        try { await service.execute(entry) }
        catch (error){
            expect(error.message).toEqual(
                'El nombre aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa no es valido')
        }
        expect.assertions(1)
    })

})