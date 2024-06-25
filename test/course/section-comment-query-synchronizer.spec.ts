import { BlogCommentQuerySyncronizer } from "src/blog/infraestructure/query-synchronizer/blog-comment-query-synchronizer"
import { SectionCommentQuerySyncronizer } from "src/course/infraestructure/query-synchronizers/section-comment-query-synchronizer"
import { BlogDomainEventObjectMother } from "test/common/objects-mothers/blog-domain-event.object-mother"
import { BlogObjectMother } from "test/common/objects-mothers/blog.object-mother"
import { CourseDomainEventObjectMother } from "test/common/objects-mothers/course-domain-event.object-mother"
import { CourseObjectMother } from "test/common/objects-mothers/course.object-mother"
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { BlogQueryRepositoryMock } from "test/common/repository-mocks/blog-query-repository.mock"
import { CourseQueryRepositoryMock } from "test/common/repository-mocks/course-query-repository.mock"
import { UserQueryRepositoryMock } from "test/common/repository-mocks/user-query-repository.mock"




describe ('SectionCommentQuerySynchronizer', () => {
    it('should save a section comment in the query database', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const course = await new CourseObjectMother(readModelObjectMother.getCourseModel(), readModelObjectMother.getCategoryModel(), readModelObjectMother.getTrainerModel()).createOdmCourse();
        const courseRepositoryMock = new CourseQueryRepositoryMock();
        courseRepositoryMock.saveCourse(course);
        
        const section = course.sections[0];

        const synchronizer = new SectionCommentQuerySyncronizer(
            courseRepositoryMock,
            readModelObjectMother.getSectionCommentModel(),
            userRepositoryMock
        );
        const sectionCommentEvent = CourseDomainEventObjectMother.createSectionCommentCreatedEvent(user.id, course.id, section.id);

        const result = await synchronizer.execute(sectionCommentEvent);

        expect(result.isSuccess()).toBeTruthy()
    })

    it('should fail if user does not exists', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const course = await new CourseObjectMother(readModelObjectMother.getCourseModel(), readModelObjectMother.getCategoryModel(), readModelObjectMother.getTrainerModel()).createOdmCourse();
        const courseRepositoryMock = new CourseQueryRepositoryMock();
        courseRepositoryMock.saveCourse(course);
        
        const section = course.sections[0];

        const synchronizer = new SectionCommentQuerySyncronizer(
            courseRepositoryMock,
            readModelObjectMother.getSectionCommentModel(),
            userRepositoryMock
        );
        const sectionCommentEvent = CourseDomainEventObjectMother.createSectionCommentCreatedEvent('c85cf817-fb81-4699-88f0-9aaff815a089', course.id, section.id);

        const result = await synchronizer.execute(sectionCommentEvent);

        expect(result.isSuccess()).toBeFalsy()
    })

    it('should fail if section or course does not exists', async () => {
        const readModelObjectMother = new ReadModelObjectMother();
        const user = await new UserObjectMother(readModelObjectMother.getUserModel()).createOdmUser();
        const userRepositoryMock = new UserQueryRepositoryMock();
        userRepositoryMock.saveUser(user);

        const course = await new CourseObjectMother(readModelObjectMother.getCourseModel(), readModelObjectMother.getCategoryModel(), readModelObjectMother.getTrainerModel()).createOdmCourse();
        const courseRepositoryMock = new CourseQueryRepositoryMock();
        courseRepositoryMock.saveCourse(course);
        
        const section = course.sections[0];

        const synchronizer = new SectionCommentQuerySyncronizer(
            courseRepositoryMock,
            readModelObjectMother.getSectionCommentModel(),
            userRepositoryMock
        );
        const sectionCommentEvent = CourseDomainEventObjectMother.createSectionCommentCreatedEvent(user.id, course.id, 'c85cf817-fb81-4699-88f0-9aaff815a089');

        const result = await synchronizer.execute(sectionCommentEvent);

        expect(result.isSuccess()).toBeFalsy()
    })
})