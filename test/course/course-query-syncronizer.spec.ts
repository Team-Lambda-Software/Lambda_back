import { CourseDomainEventObjectMother } from "test/common/objects-mothers/course-domain-event.object-mother"
import { CategoryObjectMother } from "test/common/objects-mothers/category.object-mother"
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model"
import { TrainerObjectMother } from "test/common/objects-mothers/trainer.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { CourseQueryRepositoryMock } from "test/common/repository-mocks/course-query-repository.mock"
import { CategoryQueryRepositoryMock } from "test/common/repository-mocks/category-query-repository.mock"
import { TrainerQueryRepositoryMock } from "test/common/repository-mocks/trainer-query-repository.mock"
import { UserQueryRepositoryMock } from "test/common/repository-mocks/user-query-repository.mock"
import { CourseQuerySyncronizer } from "src/course/infraestructure/query-synchronizers/course-query-synchronizer"


describe ('CourseQuerySynchronizer', () => {
    it('should save a course in the query database', async () => {

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

        const sychronizer = new CourseQuerySyncronizer(
            new CourseQueryRepositoryMock(), 
            readModelObjectMother.getCourseModel(), 
            categoryRepositoryMock, 
            trainerRepositoryMock)

        const course = CourseDomainEventObjectMother.createCourseCreatedEvent(trainer.id, category.id);

        const result = await sychronizer.execute(course);

        
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

        const sychronizer = new CourseQuerySyncronizer(
            new CourseQueryRepositoryMock(), 
            readModelObjectMother.getCourseModel(), 
            categoryRepositoryMock, 
            trainerRepositoryMock)

        const course = CourseDomainEventObjectMother.createCourseCreatedEvent('c85cf817-fb81-4699-88f0-9aaff815a089', category.id);

        const result = await sychronizer.execute(course);

        
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

        const sychronizer = new CourseQuerySyncronizer(
            new CourseQueryRepositoryMock(), 
            readModelObjectMother.getCourseModel(), 
            categoryRepositoryMock, 
            trainerRepositoryMock)

        const course = CourseDomainEventObjectMother.createCourseCreatedEvent(trainer.id, 'c85cf817-fb81-4699-88f0-9aaff815a089');

        const result = await sychronizer.execute(course);

        
        expect(result.isSuccess()).toBeFalsy()
    })
})