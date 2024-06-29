import { BlogQuerySyncronizer } from "src/blog/infraestructure/query-synchronizer/blog-query-synchronizer"
import { BlogDomainEventObjectMother } from "test/common/objects-mothers/blog-domain-event.object-mother"
import { CategoryObjectMother } from "test/common/objects-mothers/category.object-mother"
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model"
import { TrainerObjectMother } from "test/common/objects-mothers/trainer.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { BlogQueryRepositoryMock } from "test/common/repository-mocks/blog-query-repository.mock"
import { CategoryQueryRepositoryMock } from "test/common/repository-mocks/category-query-repository.mock"
import { TrainerQueryRepositoryMock } from "test/common/repository-mocks/trainer-query-repository.mock"
import { UserQueryRepositoryMock } from "test/common/repository-mocks/user-query-repository.mock"


describe ('BlogQuerySynchronizer', () => {
    it('should save a blog in the query database', async () => {

        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const trainer = await new TrainerObjectMother(readModelObjectMother.getTrainerModel()).createOdmTrainer();
        const trainerRepositoryMock = new TrainerQueryRepositoryMock();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await new CategoryObjectMother(readModelObjectMother.getCategoryModel()).createOdmCategory();
        const categoryRepositoryMock = new CategoryQueryRepositoryMock();
        categoryRepositoryMock.saveCategory(category);

        const sychronizer = new BlogQuerySyncronizer(
            new BlogQueryRepositoryMock(), 
            readModelObjectMother.getBlogModel(), 
            categoryRepositoryMock, 
            trainerRepositoryMock)

        const blog = BlogDomainEventObjectMother.createBlogCreatedEvent(trainer.id, category.id);

        const result = await sychronizer.execute(blog);

        
        expect(result.isSuccess()).toBeTruthy()
    })

    it('should fail if trainer does not exists', async () => {

        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const trainer = await new TrainerObjectMother(readModelObjectMother.getTrainerModel()).createOdmTrainer();
        const trainerRepositoryMock = new TrainerQueryRepositoryMock();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await new CategoryObjectMother(readModelObjectMother.getCategoryModel()).createOdmCategory();
        const categoryRepositoryMock = new CategoryQueryRepositoryMock();
        categoryRepositoryMock.saveCategory(category);

        const sychronizer = new BlogQuerySyncronizer(
            new BlogQueryRepositoryMock(), 
            readModelObjectMother.getBlogModel(), 
            categoryRepositoryMock, 
            trainerRepositoryMock)

        const blog = BlogDomainEventObjectMother.createBlogCreatedEvent('c85cf817-fb81-4699-88f0-9aaff815a089', category.id);

        const result = await sychronizer.execute(blog);

        
        expect(result.isSuccess()).toBeFalsy()
    })

    it('should fail if category does not exists', async () => {

        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const trainer = await new TrainerObjectMother(readModelObjectMother.getTrainerModel()).createOdmTrainer();
        const trainerRepositoryMock = new TrainerQueryRepositoryMock();
        trainerRepositoryMock.saveTrainer(trainer);

        const category = await new CategoryObjectMother(readModelObjectMother.getCategoryModel()).createOdmCategory();
        const categoryRepositoryMock = new CategoryQueryRepositoryMock();
        categoryRepositoryMock.saveCategory(category);

        const sychronizer = new BlogQuerySyncronizer(
            new BlogQueryRepositoryMock(), 
            readModelObjectMother.getBlogModel(), 
            categoryRepositoryMock, 
            trainerRepositoryMock)

        const blog = BlogDomainEventObjectMother.createBlogCreatedEvent(trainer.id, 'c85cf817-fb81-4699-88f0-9aaff815a089');

        const result = await sychronizer.execute(blog);

        
        expect(result.isSuccess()).toBeFalsy()
    })
})