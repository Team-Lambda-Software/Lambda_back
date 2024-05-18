import { Body, Controller, Inject, Logger, Post, Query, UseGuards } from "@nestjs/common"
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
import { SearchAllEntryDto } from "../dto/entry/search-all-entry.dto"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { User } from "src/user/domain/user"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { SearchAllServiceEntryDto } from "src/search/application/dto/param/search-all-service-entry.dto"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { SearchAllApplicationService } from "src/search/application/services/search-all.service"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { SearchAllByTagsEntryDto } from "../dto/entry/search-all-by-tags.dto"
import { SearchAllByTagsServiceEntryDto } from "src/search/application/dto/param/search-all-by-tags-service-entry.dto"
import { SearchAllByTagsApplicationService } from "src/search/application/services/search-all-by-tags.service"

@ApiTags('Search')
@Controller( 'search' )
export class SearchController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly blogRepository: OrmBlogRepository
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

    }

    @Post( '' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de los cursos y blogs que tengan el nombre dado', type: SearchAllSwaggerResponseDto})
    async searchCourse ( @Body() searchCourseEntryDto: SearchAllEntryDto, @GetUser()user: User, @Query() pagination: PaginationDto )
    {
        const searchAllServiceEntry: SearchAllServiceEntryDto = { ...searchCourseEntryDto, userId: user.Id, pagination: pagination}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchAllApplicationService(
                        this.courseRepository,
                        this.blogRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchAllServiceEntry )

        return result.Value
    }

    @Post( 'tags' )
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Devuelve la informacion de los cursos y blogs que tengan las tags dadas', type: SearchAllSwaggerResponseDto})
    async searchCourseByTags ( @Body() searchCourseEntryDto: SearchAllByTagsEntryDto, @GetUser()user: User, @Query() pagination: PaginationDto )
    {
        const searchAllServiceEntry: SearchAllByTagsServiceEntryDto = { ...searchCourseEntryDto, userId: user.Id, pagination: pagination}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchAllByTagsApplicationService(
                        this.courseRepository,
                        this.blogRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchAllServiceEntry )

        return result.Value
    }
}