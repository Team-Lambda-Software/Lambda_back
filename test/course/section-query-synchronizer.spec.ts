import { SectionQuerySyncronizer } from "src/course/infraestructure/query-synchronizers/section-query-synchronizer"
import { CourseDomainEventObjectMother } from "test/common/objects-mothers/course-domain-event.object-mother"
import { CourseObjectMother } from "test/common/objects-mothers/course.object-mother"
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { CourseQueryRepositoryMock } from "test/common/repository-mocks/course-query-repository.mock"
import { UserQueryRepositoryMock } from "test/common/repository-mocks/user-query-repository.mock"




describe('SectionQuerySynchronizer', () => {
    it ('should save a section in the query database', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const course = await new CourseObjectMother(readModelObjectMother.getCourseModel(), readModelObjectMother.getCategoryModel(), readModelObjectMother.getTrainerModel()).createOdmCourse();
        const courseRepositoryMock = new CourseQueryRepositoryMock();
        courseRepositoryMock.saveCourse(course);

        const synchronizer = new SectionQuerySyncronizer(
            courseRepositoryMock
        )

        const event = CourseDomainEventObjectMother.createSectionCreatedEvent(course.id);

        const result = await synchronizer.execute(event);
        expect(result.isSuccess()).toBeTruthy()
    })

    it ('should fail if course does not exists', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const course = await new CourseObjectMother(readModelObjectMother.getCourseModel(), readModelObjectMother.getCategoryModel(), readModelObjectMother.getTrainerModel()).createOdmCourse();
        const courseRepositoryMock = new CourseQueryRepositoryMock();
        courseRepositoryMock.saveCourse(course);

        const synchronizer = new SectionQuerySyncronizer(
            courseRepositoryMock
        )

        const event = CourseDomainEventObjectMother.createSectionCreatedEvent('c85cf817-fb81-4699-88f0-9aaff815a089');

        const result = await synchronizer.execute(event);
        expect(result.isSuccess()).toBeFalsy()
    })
})