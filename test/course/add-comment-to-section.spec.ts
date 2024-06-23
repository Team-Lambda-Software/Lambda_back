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

        const service = new AddCommentToSectionApplicationService(
            new CourseRepositoryMock(),
            new UuidGeneratorMock(),
            new EventHandlerMock()
        )

        const entry: AddCommentToSectionServiceEntryDto = {
            userId: user.Id.Id,
            comment: "test comment",
            section: await CourseObjectMother.createSection(),
            course: await CourseObjectMother.createCourse()
        }

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()
    })

    it ('should fail if comment is empty', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const service = new AddCommentToSectionApplicationService(
            new CourseRepositoryMock(),
            new UuidGeneratorMock(),
            new EventHandlerMock()
        )

        const entry: AddCommentToSectionServiceEntryDto = {
            userId: user.Id.Id,
            comment: "",
            section: await CourseObjectMother.createSection(),
            course: await CourseObjectMother.createCourse()
        }
        
        try {
            await service.execute(entry)
        }
        catch (error){
            expect(error.message).toEqual('El texto del comentario tiene que ser válido')
        }

        expect.assertions(1)
    })
})