import { AddSectionToCourseServiceEntryDto } from "src/course/application/dto/param/add-section-to-course-service-entry.dto"
import { AddSectionToCourseApplicationService } from "src/course/application/services/commands/add-section-to-course-application.service"
import { CourseObjectMother } from "test/common/objects-mothers/course.object-mother"
import { FileObjectMother } from "test/common/objects-mothers/file.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { EventHandlerMock } from "test/common/other-mocks/event-handler.mock"
import { FileUploaderMock } from "test/common/other-mocks/file-uploader.mock"
import { UuidGeneratorMock } from "test/common/other-mocks/uuid-generator.mock"
import { CourseRepositoryMock } from "test/common/repository-mocks/course-repository.mock"
import { UserMockRepository } from "test/common/repository-mocks/user-repository.mock"





describe('Add Section to Course', () => {
    it('should add a section to a course', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const course = await CourseObjectMother.createCourse();
        const courseRepositoryMock = new CourseRepositoryMock();
        courseRepositoryMock.saveCourseAggregate(course);

        const service = new AddSectionToCourseApplicationService(
            courseRepositoryMock,
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )


        const entry: AddSectionToCourseServiceEntryDto = {
            name: "section 1",
            description: "description of the section",
            duration: 60,
            file: await FileObjectMother.createFile(),
            courseId: course.Id.Value,
            userId: user.Id.Id
        }

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()
    })

    it('should fail if no name', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const course = await CourseObjectMother.createCourse();
        const courseRepositoryMock = new CourseRepositoryMock();
        courseRepositoryMock.saveCourseAggregate(course);

        const service = new AddSectionToCourseApplicationService(
            courseRepositoryMock,
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        const entry: AddSectionToCourseServiceEntryDto = {
            name: "",
            description: "description of the section",
            duration: 60,
            file: await FileObjectMother.createFile(),
            courseId: course.Id.Value,
            userId: user.Id.Id
        }

        try {
            await service.execute(entry)
        }
        catch (error){
            expect(error.message).toEqual('El nombre de la sección tiene que tener entre 5 y 120 caracteres')
        }
        
        expect.assertions(1)
    })

    it('should fail if invalid duration', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const course = await CourseObjectMother.createCourse();
        const courseRepositoryMock = new CourseRepositoryMock();
        courseRepositoryMock.saveCourseAggregate(course);

        const service = new AddSectionToCourseApplicationService(
            courseRepositoryMock,
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        const entry: AddSectionToCourseServiceEntryDto = {
            name: "Section 1",
            description: "description of the section",
            duration: 0,
            file: await FileObjectMother.createFile(),
            courseId: course.Id.Value,
            userId: user.Id.Id
        }

        try {
            await service.execute(entry)
        }
        catch (error){
            expect(error.message).toEqual('La duración de la sección tiene que ser válida')
        }
        
        expect.assertions(1)
    })

    it('should fail if no file', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const course = await CourseObjectMother.createCourse();
        const courseRepositoryMock = new CourseRepositoryMock();
        courseRepositoryMock.saveCourseAggregate(course);

        const service = new AddSectionToCourseApplicationService(
            courseRepositoryMock,
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        const entry: AddSectionToCourseServiceEntryDto = {
            name: "Section 1",
            description: "description of the section",
            duration: 60,
            file: null,
            courseId: course.Id.Value,
            userId: user.Id.Id
        }

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()
    })

    it('should fail if course does not exists', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const course = await CourseObjectMother.createCourse();
        const courseRepositoryMock = new CourseRepositoryMock();
        courseRepositoryMock.saveCourseAggregate(course);

        const service = new AddSectionToCourseApplicationService(
            courseRepositoryMock,
            new UuidGeneratorMock(),
            new FileUploaderMock(),
            new EventHandlerMock()
        )

        const entry: AddSectionToCourseServiceEntryDto = {
            name: "Section 1",
            description: "description of the section",
            duration: 10,
            file: await FileObjectMother.createFile(),
            courseId: 'c1a2b3c4-5d6e-7f8g-9h0i-1j2k3l4m5n6',
            userId: user.Id.Id
        }

        
        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()
        
    })

})