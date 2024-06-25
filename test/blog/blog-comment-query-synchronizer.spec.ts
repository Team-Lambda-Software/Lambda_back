import { BlogCommentQuerySyncronizer } from "src/blog/infraestructure/query-synchronizer/blog-comment-query-synchronizer"
import { BlogDomainEventObjectMother } from "test/common/objects-mothers/blog-domain-event.object-mother"
import { BlogObjectMother } from "test/common/objects-mothers/blog.object-mother"
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { BlogQueryRepositoryMock } from "test/common/repository-mocks/blog-query-repository.mock"
import { UserQueryRepositoryMock } from "test/common/repository-mocks/user-query-repository.mock"




describe ('BlogCommentQuerySynchronizer', () => {
    it('should save a blog comment in the query database', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const blog = await new BlogObjectMother(readModelObjectMother.getBlogModel(), readModelObjectMother.getCategoryModel(), readModelObjectMother.getTrainerModel()).createOdmBlog();
        const blogRepositoryMock = new BlogQueryRepositoryMock();
        blogRepositoryMock.saveBlog(blog);
        

        const synchronizer = new BlogCommentQuerySyncronizer(
            blogRepositoryMock,
            readModelObjectMother.getBlogCommentModel(),
            userRepositoryMock
        );
        const blogCommentEvent = BlogDomainEventObjectMother.createBlogCommentCreatedEvent(user.id, blog.id);

        const result = await synchronizer.execute(blogCommentEvent);

        expect(result.isSuccess()).toBeTruthy()
    })

    it('should fail if user does not exists', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const blog = await new BlogObjectMother(readModelObjectMother.getBlogModel(), readModelObjectMother.getCategoryModel(), readModelObjectMother.getTrainerModel()).createOdmBlog();
        const blogRepositoryMock = new BlogQueryRepositoryMock();
        blogRepositoryMock.saveBlog(blog);
        

        const synchronizer = new BlogCommentQuerySyncronizer(
            blogRepositoryMock,
            readModelObjectMother.getBlogCommentModel(),
            userRepositoryMock
        );
        const blogCommentEvent = BlogDomainEventObjectMother.createBlogCommentCreatedEvent('c85cf817-fb81-4699-88f0-9aaff815a089', blog.id);

        const result = await synchronizer.execute(blogCommentEvent);

        expect(result.isSuccess()).toBeFalsy()
    })

    it('should fail if blog does not exists', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const blog = await new BlogObjectMother(readModelObjectMother.getBlogModel(), readModelObjectMother.getCategoryModel(), readModelObjectMother.getTrainerModel()).createOdmBlog();
        const blogRepositoryMock = new BlogQueryRepositoryMock();
        blogRepositoryMock.saveBlog(blog);
        

        const synchronizer = new BlogCommentQuerySyncronizer(
            blogRepositoryMock,
            readModelObjectMother.getBlogCommentModel(),
            userRepositoryMock
        );
        const blogCommentEvent = BlogDomainEventObjectMother.createBlogCommentCreatedEvent(user.id, 'c85cf817-fb81-4699-88f0-9aaff815a089');

        const result = await synchronizer.execute(blogCommentEvent);

        expect(result.isSuccess()).toBeFalsy()
    })
})