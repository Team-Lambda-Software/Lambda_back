import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Course } from "src/course/domain/course"
import { OrmCourse } from "../../entities/orm-entities/orm-course"
import { Section } from "src/course/domain/entities/section"
import { Image } from "src/course/domain/entities/compose-fields/image"
import { OrmSection } from "../../entities/orm-entities/orm-section"
import { Video } from "src/course/domain/entities/compose-fields/video"
import { SectionComment } from "src/course/domain/entities/section-comment"
import { Paragraph } from "src/course/domain/entities/compose-fields/paragraph"
import { OrmSectionMapper } from "./orm-section-mapper"



export class OrmCourseMapper implements IMapper<Course, OrmCourse>
{
    private readonly ormSectionMapper: OrmSectionMapper

    constructor ( ormSectionMapper: OrmSectionMapper )
    {
        this.ormSectionMapper = ormSectionMapper
    }

    fromDomainToPersistence ( domain: Course ): Promise<OrmCourse>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( persistence: OrmCourse ): Promise<Course>
    {
        let sections: Section[] = []
        for ( const section of persistence.sections )
        {
            sections.push( await this.ormSectionMapper.fromPersistenceToDomain( section ) )
        }
        //TODO relacion con trainer y con categoria
        const course: Course =
            Course.create( persistence.id, '15asdas', persistence.name, persistence.description, persistence.weeks_duration, persistence.minutes_per_section, persistence.level, sections, 'asdasd', Image.create( persistence.image.id, persistence.image.url ) )

        return course
    }

}