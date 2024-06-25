import { Controller, Get, Inject, Logger, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { JwtAuthGuard } from "src/auth/infraestructure/jwt/decorator/jwt-auth.guard"
import { DataSource } from "typeorm"
import { SearchAllSwaggerResponseDto } from "../dto/responses/search-all-swagger-response.dto"
import { GetUser } from "src/auth/infraestructure/jwt/decorator/get-user.param.decorator"
import { PaginationDto } from "src/common/Infraestructure/dto/entry/pagination.dto"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { SearchQueryParametersDto } from "../dto/queryParameters/search-query-parameters.dto"
import { HttpExceptionHandler } from "src/common/Infraestructure/http-exception-handler/http-exception-handler"
import { SearchAllServiceEntryDto } from "../query-services/dto/param/search-all-service-entry.dto"
import { SearchAllService } from "../query-services/services/search-all.service"
import { OdmBlogRepository } from "src/blog/infraestructure/repositories/odm-repository/odm-blog-repository"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { OdmBlogEntity } from "src/blog/infraestructure/entities/odm-entities/odm-blog.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { OdmBlogCommentEntity } from "src/blog/infraestructure/entities/odm-entities/odm-blog-comment.entity"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"
import { OdmSectionCommentEntity } from "src/course/infraestructure/entities/odm-entities/odm-section-comment.entity"
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity"
import { OdmCourseRepository } from "src/course/infraestructure/repositories/odm-repositories/odm-course-repository"
import { SearchAllTagsService } from "../query-services/services/search-all-tags.service"

@ApiTags( 'Search' )
@Controller( 'search' )
export class SearchController
{

    private readonly blogRepository: OdmBlogRepository
    private readonly courseRepository: OdmCourseRepository

    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) dataSource: DataSource,
            @InjectModel('Blog') private blogModel: Model<OdmBlogEntity>,
            @InjectModel('Category') private categoryModel: Model<OdmCategoryEntity>,
            @InjectModel('Trainer') private trainerModel: Model<OdmTrainerEntity>,
            @InjectModel('BlogComment') private blogCommentModel: Model<OdmBlogCommentEntity>,
            @InjectModel('User') private userModel: Model<OdmUserEntity>,
            @InjectModel('SectionComment') private sectionCommentModel: Model<OdmSectionCommentEntity>,
            @InjectModel('Course') private courseModel: Model<OdmCourseEntity> )
    {
        this.courseRepository = new OdmCourseRepository( courseModel, sectionCommentModel)
        this.blogRepository =
            new OdmBlogRepository(
                blogModel,
                blogCommentModel
            )

    }

    @Get( '' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve la informacion de los cursos y blogs que tengan el nombre dado', type: SearchAllSwaggerResponseDto } )
    async searchCourse ( @GetUser() user, @Query() searchQueryParametersDto: SearchQueryParametersDto )
    {
        const pagination: PaginationDto = { page: searchQueryParametersDto.page, perPage: searchQueryParametersDto.perPage }
        
        if ( !searchQueryParametersDto.term ){
            searchQueryParametersDto.term = ''
        }
        if ( !searchQueryParametersDto.tag ){
            searchQueryParametersDto.tag = []
        }
        const searchAllServiceEntry: SearchAllServiceEntryDto = { userId: user.id, pagination: pagination, name: searchQueryParametersDto.term, tags: searchQueryParametersDto.tag }
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchAllService(
                        this.courseRepository,
                        this.blogRepository
                    ),
                    new NativeLogger( this.logger )
                ),
                new HttpExceptionHandler()
            )
        const result = await service.execute( searchAllServiceEntry )

        return result.Value

    
    }

    @Get( '/popular/tags' )
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiOkResponse( { description: 'Devuelve los tags', type: PaginationDto } )
    async searchTags ( @GetUser() user, @Query() pagination: PaginationDto )
    {
        
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchAllTagsService(
                        this.courseRepository,
                        this.blogRepository
                    ),
                    new NativeLogger( this.logger )
                ),
                new HttpExceptionHandler()
            )
        const result = await service.execute( {pagination, userId: user.id} )

        return result.Value

    
    }

}