import { AddCommentToBlogServiceEntryDto } from "src/blog/application/dto/params/add-comment-to-blog-service-entry.dto"
import { AddCommentToBlogApplicationService } from "src/blog/application/services/commands/add-comment-to-blog-application.service"
import { AddCommentEntryDto } from "src/comment/infraestructure/dto/entry/add-comment-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { AddCommentToSectionServiceEntryDto } from "src/course/application/dto/param/add-comment-to-section-service-entry.dto"
import { AddCommentToSectionApplicationService } from "src/course/application/services/commands/add-comment-to-section-application.service"
import { BlogObjectMother } from "test/common/objects-mothers/blog.object-mother"
import { CourseObjectMother } from "test/common/objects-mothers/course.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { EventHandlerMock } from "test/common/other-mocks/event-handler.mock"
import { UuidGeneratorMock } from "test/common/other-mocks/uuid-generator.mock"
import { BlogRepositoryMock } from "test/common/repository-mocks/blog-repository.mock"
import { CourseRepositoryMock } from "test/common/repository-mocks/course-repository.mock"
import { UserMockRepository } from "test/common/repository-mocks/user-repository.mock"




describe('Add Comment to Section', () => {
    it('should add a comment to a Section', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const course = await CourseObjectMother.createCourse();
        const courseRepositoryMock = new CourseRepositoryMock();
        courseRepositoryMock.saveCourseAggregate(course);

        const service = new AddCommentToSectionApplicationService(
            courseRepositoryMock,
            new UuidGeneratorMock(),
            new EventHandlerMock()
        )

       

        const section = await CourseObjectMother.createSection();
        courseRepositoryMock.addSectionToCourse(course.Id.Value, section);


        const entry: AddCommentToSectionServiceEntryDto = {
            userId: user.Id.Id,
            comment: "test comment",
            sectionId: section.Id.Value,
        }

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()
    })

    it ('should fail if comment is empty', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const course = await CourseObjectMother.createCourse();
        const courseRepositoryMock = new CourseRepositoryMock();
        courseRepositoryMock.saveCourseAggregate(course);

        const service = new AddCommentToSectionApplicationService(
            courseRepositoryMock,
            new UuidGeneratorMock(),
            new EventHandlerMock()
        )

        
        const section = await CourseObjectMother.createSection();
        courseRepositoryMock.addSectionToCourse(course.Id.Value, section);

        const entry: AddCommentToSectionServiceEntryDto = {
            userId: user.Id.Id,
            comment: "",
            sectionId: section.Id.Value,
        }
        
        try {
            await service.execute(entry)
        }
        catch (error){
            expect(error.message).toEqual('El texto del comentario tiene que ser válido')
        }

        expect.assertions(1)
    })

    it ('should fail if section does not exists in any course', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const course = await CourseObjectMother.createCourse();
        const courseRepositoryMock = new CourseRepositoryMock();
        courseRepositoryMock.saveCourseAggregate(course);

        const service = new AddCommentToSectionApplicationService(
            courseRepositoryMock,
            new UuidGeneratorMock(),
            new EventHandlerMock()
        )

        const section = await CourseObjectMother.createSection();
        courseRepositoryMock.addSectionToCourse(course.Id.Value, section);

        const entry: AddCommentToSectionServiceEntryDto = {
            userId: user.Id.Id,
            comment: "test comment",
            sectionId: "c1b4e5d4-0b3b-4b3b-8b3b-3b4b3b4b3b3b",
        }
        
        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()
    })
})