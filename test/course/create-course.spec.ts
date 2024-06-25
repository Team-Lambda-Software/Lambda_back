import e from "express"
import { CreateCourseServiceEntryDto } from "src/course/application/dto/param/create-course-service-entry.dto"
import { CreateCourseApplicationService } from "src/course/application/services/commands/create-course-application.service"
import { CategoryObjectMother } from "test/common/objects-mothers/category.object-mother"
import { FileObjectMother } from "test/common/objects-mothers/file.object-mother"
import { TrainerObjectMother } from "test/common/objects-mothers/trainer.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { EventHandlerMock } from "test/common/other-mocks/event-handler.mock"
import { FileUploaderMock } from "test/common/other-mocks/file-uploader.mock"
import { UuidGeneratorMock } from "test/common/other-mocks/uuid-generator.mock"
import { BlogRepositoryMock } from "test/common/repository-mocks/blog-repository.mock"
import { CourseRepositoryMock } from "test/common/repository-mocks/course-repository.mock"
import { TrainerMockRepository } from "test/common/repository-mocks/trainer-repository.mock"
import { UserMockRepository } from "test/common/repository-mocks/user-repository.mock"


describe('Create Course', () => {
    it('should create a course', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await CategoryObjectMother.createNormalCategory('category 1');

        const entry: CreateCourseServiceEntryDto ={
            trainer: trainer,
            name: "Curso yoga",
            description: "desripction of the course",
            weeksDuration: 10,
            minutesDuration: 50,
            level: 2,
            category: category,
            tags: ['test'],
            image: await FileObjectMother.createFile(),
            userId: user.Id.Id
        }

        const service = new CreateCourseApplicationService(
            new CourseRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()
                
    })

    it('should fail if no name', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await CategoryObjectMother.createNormalCategory('category 1');

        const entry: CreateCourseServiceEntryDto ={
            trainer: trainer,
            name: "",
            description: "desripction of the course",
            weeksDuration: 10,
            minutesDuration: 50,
            level: 2,
            category: category,
            tags: ['test'],
            image: await FileObjectMother.createFile(),
            userId: user.Id.Id
        }

        const service = new CreateCourseApplicationService(
            new CourseRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        try{
            await service.execute(entry)
        }catch(error){
            expect(error.message).toEqual('El nombre del curso tiene que tener entre 5 y 120 caracteres')
        }
        expect.assertions(1)
                
    })

    it('should fail if invalid weeks duration', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await CategoryObjectMother.createNormalCategory('category 1');

        const entry: CreateCourseServiceEntryDto ={
            trainer: trainer,
            name: "Course 1",
            description: "desripction of the course",
            weeksDuration: 0,
            minutesDuration: 50,
            level: 2,
            category: category,
            tags: ['test'],
            image: await FileObjectMother.createFile(),
            userId: user.Id.Id
        }

        const service = new CreateCourseApplicationService(
            new CourseRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        try{
            await service.execute(entry)
        }catch(error){
            expect(error.message).toEqual('La duracion en semanas del curso tiene que ser valida')
        }
        expect.assertions(1)
                
    })

    it('should fail if invalid minutes duration', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await CategoryObjectMother.createNormalCategory('category 1');

        const entry: CreateCourseServiceEntryDto ={
            trainer: trainer,
            name: "Course 1",
            description: "desripction of the course",
            weeksDuration: 10,
            minutesDuration: 0,
            level: 2,
            category: category,
            tags: ['test'],
            image: await FileObjectMother.createFile(),
            userId: user.Id.Id
        }

        const service = new CreateCourseApplicationService(
            new CourseRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        try{
            await service.execute(entry)
        }catch(error){
            expect(error.message).toEqual('La duración en minutos del curso tiene que ser válida')
        }
        expect.assertions(1)
                
    })

    it('should fail if invalid level', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const trainer = await TrainerObjectMother.createNormalTrainer();
        const trainerRepositoryMock = new TrainerMockRepository();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await CategoryObjectMother.createNormalCategory('category 1');

        const entry: CreateCourseServiceEntryDto ={
            trainer: trainer,
            name: "Course 1",
            description: "desripction of the course",
            weeksDuration: 10,
            minutesDuration: 10,
            level: 0,
            category: category,
            tags: ['test'],
            image: await FileObjectMother.createFile(),
            userId: user.Id.Id
        }

        const service = new CreateCourseApplicationService(
            new CourseRepositoryMock(),
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        try{
            await service.execute(entry)
        }catch(error){
            expect(error.message).toEqual('El nivel del curso tiene que estar entre 1 y 5')
        }
        expect.assertions(1)
                
    })

})