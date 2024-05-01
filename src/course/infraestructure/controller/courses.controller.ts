import { Body, Controller, Get, Inject, Logger, Param, ParseUUIDPipe, Post } from "@nestjs/common"
import { ExceptionDecorator } from "src/common/Application/application-services/decorators/decorators/exception-decorator/exception.decorator"
import { LoggingDecorator } from "src/common/Application/application-services/decorators/decorators/logging-decorator/logging.decorator"
import { GetCourseApplicationService } from "src/course/application/services/queries/get-course.service"
import { DataSource } from "typeorm"
import { OrmCourseRepository } from "../repositories/orm-repositories/orm-couser-repository"
import { OrmCourseMapper } from "../mappers/orm-mappers/orm-course-mapper"
import { NativeLogger } from "src/common/Infraestructure/logger/logger"
import { OrmSectionMapper } from "../mappers/orm-mappers/orm-section-mapper"
import { SearchCourseApplicationService } from "src/course/application/services/queries/search-course.service"
import { SearchCourseEntryDto } from "../dto/entry/search-course-entry.dto"
import { SearchCourseServiceEntryDto } from "src/course/application/dto/param/search-course-service-entry.dto"
import { SearchCourseByCategoryServiceEntryDto } from "src/course/application/dto/param/search-course-by-category-service-entry.dto"
import { SearchCourseByCategoryApplicationService } from "src/course/application/services/queries/search-course-by-category.service"
import { OrmSectionCommentMapper } from "../mappers/orm-mappers/orm-section-comment-mapper"
import { GetCourseSectionApplicationService } from "src/course/application/services/queries/get-course-section.service"
import { GetCourseSectionServiceEntryDto } from "src/course/application/dto/param/get-course-section-service-entry.dto"
import { AddCommentToSectionEntryDto } from "../dto/entry/add-comment-to-section-entry.dto"
import { IdGenerator } from "src/common/Application/Id-generator/id-generator.interface"
import { UuidGenerator } from "src/common/Infraestructure/id-generator/uuid-generator"
import { AddCommentToSectionApplicationService } from "src/course/application/services/commands/add-comment-to-section-application.service"



@Controller( 'course' )
export class CourseController
{

    private readonly courseRepository: OrmCourseRepository
    private readonly idGenerator: IdGenerator<string>
    private readonly logger: Logger = new Logger( "CourseController" )
    constructor ( @Inject( 'DataSource' ) private readonly dataSource: DataSource )
    {
        this.idGenerator = new UuidGenerator()
        this.courseRepository =
            new OrmCourseRepository(
                new OrmCourseMapper(
                    new OrmSectionMapper()
                ),
                new OrmSectionMapper(),
                new OrmSectionCommentMapper(),
                dataSource
            )

    }

    @Get( ':id' )
    async getCourse ( @Param( 'id' ) id: string )
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetCourseApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( { courseId: id, userId: '1' } )
        return result.Value
    }

    @Post( 'search' )
    async searchCourse ( @Body() searchCourseEntryDto: SearchCourseEntryDto )
    {
        const searchCourseServiceEntry: SearchCourseServiceEntryDto = { ...searchCourseEntryDto, userId: '2'}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchCourseApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchCourseServiceEntry )

        return result.Value
    }

    @Get( 'category/:categoryId' )
    async searchCourseByCategory ( @Param('categoryId', ParseUUIDPipe) categoryId: string )
    {
        const searchCourseByCategoryServiceEntry: SearchCourseByCategoryServiceEntryDto = { categoryId, userId: '2'}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new SearchCourseByCategoryApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        const result = await service.execute( searchCourseByCategoryServiceEntry )

        return result.Value
    }

    @Get( 'section/:sectionId' )
    async getSection ( @Param( 'sectionId' ) sectionId: string )
    {
        const data: GetCourseSectionServiceEntryDto = { sectionId, userId: '2'}
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new GetCourseSectionApplicationService(
                        this.courseRepository
                    ),
                    new NativeLogger( this.logger )
                )
            )
        
        const result = await service.execute( data )

        return result.Value
    }

    @Post( 'section/:sectionId/comment' )
    async addCommentToSection ( @Param( 'sectionId' ) sectionId: string, @Body() comment: AddCommentToSectionEntryDto)
    {
        const service =
            new ExceptionDecorator(
                new LoggingDecorator(
                    new AddCommentToSectionApplicationService(
                        this.courseRepository,
                        this.idGenerator
                    ),
                    new NativeLogger( this.logger )
                )
            )

        const data = { ...comment, sectionId, userId: 'df0595a1-ba58-47c7-ace6-b3d734b27a66' }
        const result = await service.execute( data )
        return result.Value
    }


}