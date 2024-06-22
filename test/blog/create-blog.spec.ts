import e from "express"
import { CreateBlogServiceEntryDto } from "src/blog/application/dto/params/create-blog-service-entry.dto"
import { CreateBlogApplicationService } from "src/blog/application/services/commands/create-blog-application.service"
import { CategoryObjectMother } from "test/common/objects-mothers/category.object-mother"
import { FileObjectMother } from "test/common/objects-mothers/file.object-mother"
import { TrainerObjectMother } from "test/common/objects-mothers/trainer.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { EventHandlerMock } from "test/common/other-mocks/event-handler.mock"
import { FileUploaderMock } from "test/common/other-mocks/file-uploader.mock"
import { UuidGeneratorMock } from "test/common/other-mocks/uuid-generator.mock"
import { BlogRepositoryMock } from "test/common/repository-mocks/blog-repository.mock"
import { CategoryMockRepository } from "test/common/repository-mocks/category-repository.mock"
import { TrainerMockRepository } from "test/common/repository-mocks/trainer-repository.mock"
import { UserMockRepository } from "test/common/repository-mocks/user-repository.mock"


describe('Create Blog', () => {
    it('should create a blog', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await CategoryObjectMother.createNormalCategory('category 1');

        const entry: CreateBlogServiceEntryDto ={
            trainerId: trainer.Id,
            title: "new blog",
            body: "body of the new blog",
            images: [await FileObjectMother.createFile()],
            categoryId: category.Id.Value,
            tags: ['test'],
            userId: user.Id.Id
        }

        const service = new CreateBlogApplicationService(
            new BlogRepositoryMock(),
            new UuidGeneratorMock(),
            trainerRepositoryMock,
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()
                
    })

    it('should fail if no title', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await CategoryObjectMother.createNormalCategory('category 1');

        const entry: CreateBlogServiceEntryDto ={
            trainerId: trainer.Id,
            title: "",
            body: "body of the new blog",
            images: [await FileObjectMother.createFile()],
            categoryId: category.Id.Value,
            tags: ['test'],
            userId: user.Id.Id
        }

        const service = new CreateBlogApplicationService(
            new BlogRepositoryMock(),
            new UuidGeneratorMock(),
            trainerRepositoryMock,
            new FileUploaderMock(),
            new EventHandlerMock()
        )
        try{
            await service.execute(entry)
        }catch(error){
            expect(error.message).toEqual('El titulo del blog tiene que tener entre 5 y 120 caracteres')
        }
        expect.assertions(1)
    })

    it('should fail if no body', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await CategoryObjectMother.createNormalCategory('category 1');

        const entry: CreateBlogServiceEntryDto ={
            trainerId: trainer.Id,
            title: "Title of the new blog",
            body: "",
            images: [await FileObjectMother.createFile()],
            categoryId: category.Id.Value,
            tags: ['test'],
            userId: user.Id.Id
        }

        const service = new CreateBlogApplicationService(
            new BlogRepositoryMock(),
            new UuidGeneratorMock(),
            trainerRepositoryMock,
            new FileUploaderMock(),
            new EventHandlerMock()
        )
        try{
            await service.execute(entry)
        }catch(error){
            expect(error.message).toEqual('El Body del blog tiene que tener mas de 5 caracteres')
        }
        expect.assertions(1)
    })

})