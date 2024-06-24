import { BlogQuerySyncronizer } from "src/blog/infraestructure/query-synchronizer/blog-query-synchronizer"
import { BlogDomainEventObjectMother } from "test/common/objects-mothers/blog-domain-event.object-mother"
import { ReadModelObjectMother } from "test/common/objects-mothers/read-model.object-model"
import { BlogQueryRepositoryMock } from "test/common/repository-mocks/blog-query-repository.mock"


// describe ('BlogQuerySynchronizer', () => {
//     it('should save a blog in the query database', async () => {

//         const readModelObjectMother = new ReadModelObjectMother()

//         const synchronizer = new BlogQuerySyncronizer(
//             new BlogQueryRepositoryMock(),
//             readModelObjectMother.getBlogModel(),
//             readModelObjectMother.getCategoryModel(),
//             readModelObjectMother.getTrainerModel()
//         )

//         const event = BlogDomainEventObjectMother.createBlogCreatedEvent()

//         const result = await synchronizer.execute(event)

//         expect(result.isSuccess()).toBeTruthy()
//     })
// })