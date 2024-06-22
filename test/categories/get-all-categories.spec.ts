import { GetAllCategoriesService } from "src/categories/infraesctructure/query-services/services/get-all-category.service"
import { CategoryObjectMother } from "test/common/objects-mothers/category.object-mother"
import { UserObjectMother } from "test/common/objects-mothers/user.object-mother"
import { CategoryMockRepository } from "test/common/repository-mocks/category-repository.mock"
import { UserMockRepository } from "test/common/repository-mocks/user-repository.mock"



describe('Get all categories', () => {
    it('should return all categories', async () => {
        const user = await UserObjectMother.createNormalUser();
        const userRepositoryMock = new UserMockRepository();
        userRepositoryMock.saveUserAggregate(user);

        const category1 = await CategoryObjectMother.createNormalCategory('Category 1');
        const category2 = await CategoryObjectMother.createNormalCategory('Category 2');
        const category3 = await CategoryObjectMother.createNormalCategory('Category 3');
        const categoryRepositoryMock = new CategoryMockRepository();
        categoryRepositoryMock.createCategory(category1);
        categoryRepositoryMock.createCategory(category2);
        categoryRepositoryMock.createCategory(category3);

    })
})