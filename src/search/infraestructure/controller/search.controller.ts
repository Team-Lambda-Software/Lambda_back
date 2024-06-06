import { Body, Controller, Get, Inject, Logger, Post, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { OrmBlogCommentMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-comment-mapper"
import { OrmBlogMapper } from "src/blog/infraestructure/mappers/orm-mappers/orm-blog-mapper"
import { OrmBlogRepository } from "src/blog/infraestructure/repositories/orm-repositories/orm-blog-repository"
import { OrmCourseMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-course-mapper"
import { OrmSectionCommentMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-comment-mapper"
import { OrmSectionMapper } from "src/course/infraestructure/mappers/orm-mappers/orm-section-mapper"
import { OrmCourseRepository } from "src/course/infraestructure/repositories/orm-repositories/orm-couser-repository"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { DataSource } from "typeorm"
import { SearchAllSwaggerResponseDto } from "../dto/responses/search-all-swagger-response.dto"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { SearchAllServiceEntryDto } from "src/search/application/dto/param/search-all-service-entry.dto"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { SearchAllApplicationService } from "src/search/application/services/search-all.service"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { SearchAllByTagsServiceEntryDto } from "src/search/application/dto/param/search-all-by-tags-service-entry.dto"
import { SearchAllByTagsApplicationService } from "src/search/application/services/search-all-by-tags.service"
import { OrmCategoryRepository } from "src/categories/infraesctructure/repositories/orm-repositories/orm-category-repository"
import { OrmTrainerRepository } from "src/trainer/infraestructure/repositories/orm-repositories/orm-trainer-repository"
import { OrmCategoryMapper } from "src/categories/infraesctructure/mappers/orm-mappers/orm-category-mapper"
import { SearchQueryParametersDto } from "../dto/queryParameters/search-query-parameters.dto"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"

@ApiTags( 'Search' )
@Controller( 'search' )
export class SearchController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly blogRepository: OrmBlogRepository
    private readonly categoryRepository: OrmCategoryRepository
    private readonly trainerRepository: OrmTrainerRepository
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.courseRepository =
            new OrmCourseRepository(
                new OrmCourseMapper(
                    new OrmSectionMapper(),
                    new OrmTrainerMapper()
                ),
                new OrmSectionMapper(),
                new OrmSectionCommentMapper(),
                dataSource
            )
        this.blogRepository =
            new OrmBlogRepository(
                new OrmBlogMapper(
                    new OrmTrainerMapper
                ),
                new OrmBlogCommentMapper(),
                dataSource
            )

        this.categoryRepository = new OrmCategoryRepository(
            new OrmCategoryMapper(),
            dataSource )

        this.trainerRepository = new OrmTrainerRepository(
            new OrmTrainerMapper(),
            dataSource
        )


    }

    @Get( '' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de los cursos y blogs que tengan el nombre dado', type: SearchAllSwaggerResponseDto } )
    async searchCourse ( @GetUser() user: User, @Query() searchQueryParametersDto: SearchQueryParametersDto )
    {
        const pagination: PaginationDto = { page: searchQueryParametersDto.page, perPage: searchQueryParametersDto.perPage }

        if ( searchQueryParametersDto.tag )
        {
            const searchAllByTagsServiceEntry: SearchAllByTagsServiceEntryDto = { userId: user.Id, pagination: pagination, tags: searchQueryParametersDto.tag }
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new SearchAllByTagsApplicationService(
                            this.courseRepository,
                            this.blogRepository,
                            this.categoryRepository,
                            this.trainerRepository
                        ),
                        new NativeLogger( this.logger )
                    ),
                    new HttpExceptionHandler()
                )
            const result = await service.execute( searchAllByTagsServiceEntry )

            return result.Value

        }
        else
        {
            if ( !searchQueryParametersDto.term ){
                searchQueryParametersDto.term = ''
            }
            const searchAllServiceEntry: SearchAllServiceEntryDto = { userId: user.Id, pagination: pagination, name: searchQueryParametersDto.term}
            const service =
                new ExceptionDecorator(
                    new LoggingDecorator(
                        new SearchAllApplicationService(
                            this.courseRepository,
                            this.blogRepository,
                            this.categoryRepository,
                            this.trainerRepository
                        ),
                        new NativeLogger( this.logger )
                    ),
                    new HttpExceptionHandler()
                )
            const result = await service.execute( searchAllServiceEntry )

            return result.Value

        }
    }

}