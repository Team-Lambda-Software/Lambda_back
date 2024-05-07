import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Categorie } from "src/categories/domain/categories";
import { Result } from "src/common/Application/result-handler/Result";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface";
import { SearchContentByCategoryEntryDto } from "../Dto/search-content-by-category-entry.dto";
import { Course } from "src/course/domain/course";
import { Blog } from "src/blog/domain/blog";

export class SearchContentByCategoryApplicationService implements IApplicationService<SearchContentByCategoryEntryDto, { courses: Course[], blogs: Blog[] }> {
    
    private readonly courseRepository: ICourseRepository;
    private readonly blogRepository: IBlogRepository;

    constructor(courseRepository: ICourseRepository, blogRepository: IBlogRepository) {
        this.courseRepository = courseRepository;
        this.blogRepository = blogRepository;
    }
    
    async execute(data: SearchContentByCategoryEntryDto): Promise<Result<{ courses: Course[], blogs: Blog[] }>> {
        const { categoryId, pagination } = data;
        const { offset = 0, limit = 10 } = pagination;
        
        const coursesPromise = this.courseRepository.findCoursesByCategory(data.categoryId, { offset, limit });
        const blogsPromise = this.blogRepository.findBlogsByCategory(data.categoryId, { offset, limit });

        const [courses, blogs] = await Promise.all([coursesPromise, blogsPromise]);

        return Result.success({ courses, blogs });
    }

    get name(): string {
        return this.constructor.name;
    }
}