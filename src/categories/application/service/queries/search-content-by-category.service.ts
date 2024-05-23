import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface";
import { IBlogRepository } from "src/blog/domain/repositories/blog-repository.interface";
import { SearchContentByCategoryServiceEntryDto } from "../../Dto/param/search-content-by-category-service-entry.dto"
import { SearchContentByCategoryServiceResponseDto } from "../../Dto/responses/search-content-by-category-service-response.dto"
import { Course } from "src/course/domain/course"
import { Blog } from "src/blog/domain/blog"

export class SearchContentByCategoryApplicationService implements IApplicationService<SearchContentByCategoryServiceEntryDto, SearchContentByCategoryServiceResponseDto> {
    
    private readonly courseRepository: ICourseRepository;
    private readonly blogRepository: IBlogRepository;

    constructor(courseRepository: ICourseRepository, blogRepository: IBlogRepository) {
        this.courseRepository = courseRepository;
        this.blogRepository = blogRepository;
    }
    
    async execute(data: SearchContentByCategoryServiceEntryDto): Promise<Result<SearchContentByCategoryServiceResponseDto>> {
        const { categoryId, pagination } = data;
        const { page = 0, perPage = 10 } = pagination;
        
        let courses: Course[] = [];
        let blogs: Blog[] = [];
        const resultCourses = await this.courseRepository.findCoursesByCategory(categoryId, { page, perPage });
        if (!resultCourses.isSuccess()) {
            if (resultCourses.StatusCode != 404) {
                return Result.fail<SearchContentByCategoryServiceResponseDto>(resultCourses.Error, resultCourses.StatusCode, resultCourses.Message);
            }
        } else {
            courses = resultCourses.Value;
        }
        const resultBlogs = await this.blogRepository.findBlogsByCategory(categoryId, { page, perPage });
        if (!resultBlogs.isSuccess()) {
            if (resultBlogs.StatusCode != 404) {
                return Result.fail<SearchContentByCategoryServiceResponseDto>(resultBlogs.Error, resultBlogs.StatusCode, resultBlogs.Message);
            }
        }else{
            blogs = resultBlogs.Value;
        }


        return Result.success({ courses, blogs }, 200);
    }

    get name(): string {
        return this.constructor.name;
    }
}