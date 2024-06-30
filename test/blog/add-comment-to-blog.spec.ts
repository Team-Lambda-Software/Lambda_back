import { AddCommentEntryDto } from "src/comment/infraestructure/dto/entry/add-comment-entry.dto"
import { Result } from "src/common/Domain/result-handler/Result"
import { AddCommentToBlogApplicationService } from "src/blog/application/services/commands/add-comment-to-blog-application.service"
import { BlogObjectMother } from "test/common/objects-mothers/blog.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { EventHandlerMock } from "test/common/other-mocks/event-handler.mock"
import { UuidGeneratorMock } from "test/common/other-mocks/uuid-generator.mock"
import { BlogRepositoryMock } from "test/common/repository-mocks/blog-repository.mock"
import { UserMockRepository } from "test/common/repository-mocks/user-repository.mock"
import { AddCommentToBlogServiceEntryDto } from "src/blog/application/dto/params/add-comment-to-blog-service-entry.dto"




describe('Add Comment to Blog', () => {
    it('should add a comment to a Blog', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const blog = await BlogObjectMother.createBlog();
        const blogRepositoryMock = new BlogRepositoryMock();
        blogRepositoryMock.saveBlogAggregate(blog);

        const service = new AddCommentToBlogApplicationService(
            blogRepositoryMock,
            new UuidGeneratorMock(),
            new EventHandlerMock()
        )

        const entry: AddCommentToBlogServiceEntryDto = {
            userId: user.Id.Id,
            comment: "test comment",
            blogId: blog.Id.Value,
        }

        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeTruthy()
    })

    it ('should fail if comment is empty', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const blog = await BlogObjectMother.createBlog();
        const blogRepositoryMock = new BlogRepositoryMock();
        blogRepositoryMock.saveBlogAggregate(blog);

        const service = new AddCommentToBlogApplicationService(
            blogRepositoryMock,
            new UuidGeneratorMock(),
            new EventHandlerMock()
        )

        const entry: AddCommentToBlogServiceEntryDto = {
            userId: user.Id.Id,
            comment: "",
            blogId: blog.Id.Value,
        }
        
        try {
            await service.execute(entry)
        }
        catch (error){
            expect(error.message).toEqual('El texto del comentario tiene que ser válido')
        }

        expect.assertions(1)
    })

    it ('should fail if blog does not exists', async () => {

        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const blog = await BlogObjectMother.createBlog();
        const blogRepositoryMock = new BlogRepositoryMock();
        blogRepositoryMock.saveBlogAggregate(blog);

        const service = new AddCommentToBlogApplicationService(
            blogRepositoryMock,
            new UuidGeneratorMock(),
            new EventHandlerMock()
        )

        const entry: AddCommentToBlogServiceEntryDto = {
            userId: user.Id.Id,
            comment: "test comment",
            blogId: 'c1b4b3b3-1b3b-4b3b-8b3b-1b3b4b3b3b3b',
        }
        
        const result = await service.execute(entry)

        expect(result.isSuccess()).toBeFalsy()
    })


})