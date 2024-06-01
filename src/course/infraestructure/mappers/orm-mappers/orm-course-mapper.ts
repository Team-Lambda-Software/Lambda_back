import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Course } from "src/course/domain/course"
import { OrmCourse } from "../../entities/orm-entities/orm-course"
import { Section } from "src/course/domain/entities/section"

import { OrmSectionMapper } from "./orm-section-mapper"
import { SectionImage } from "src/course/domain/entities/compose-fields/section-image"
import { Trainer } from "src/trainer/domain/trainer"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { OrmSectionImage } from '../../entities/orm-entities/orm-section-images';
import { OrmCourseTags } from "../../entities/orm-entities/orm-course-tags"



export class OrmCourseMapper implements IMapper<Course, OrmCourse>
{
    private readonly ormSectionMapper: OrmSectionMapper
    private readonly ormTrainerMapper: OrmTrainerMapper

    constructor ( ormSectionMapper: OrmSectionMapper, ormTrainerMapper: OrmTrainerMapper)
    {
        this.ormSectionMapper = ormSectionMapper
        this.ormTrainerMapper = ormTrainerMapper
    }

    async fromDomainToPersistence ( domain: Course ): Promise<OrmCourse>
    {
        let tags: OrmCourseTags[] = []
        domain.Tags.forEach(tag => {
            tags.push(OrmCourseTags.create(tag))
        })
        return OrmCourse.create( domain.Id, domain.Name, domain.Description, domain.Level, domain.WeeksDuration, domain.MinutesDuration, domain.Trainer.Id, domain.CategoryId, OrmSectionImage.create(domain.Image.Id, domain.Image.Url), tags)
    }
    async fromPersistenceToDomain ( persistence: OrmCourse ): Promise<Course>
    {
        let sections: Section[] = []
        if (persistence.sections){
            
            for ( const section of persistence.sections )
            {
                sections.push( await this.ormSectionMapper.fromPersistenceToDomain( section ) )
            }
        }
        let tags: string[] = []
        if (persistence.tags){
            for ( const tag of persistence.tags )
            {
                tags.push(tag.name)
            }
        }
        //TODO relacion con trainer y con categoria

        const trainer = await this.ormTrainerMapper.fromPersistenceToDomain(persistence.trainer)
        console.log(trainer)
        const course: Course =
            Course.create( persistence.id, trainer, persistence.name, persistence.description, persistence.weeks_duration, persistence.minutes_per_section, persistence.level, sections, persistence.category_id, SectionImage.create( persistence.image.url, persistence.image.id ), tags, persistence.date)
        return course
    }

}