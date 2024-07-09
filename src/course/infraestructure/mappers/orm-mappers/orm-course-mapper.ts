import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Course } from "src/course/domain/course"
import { OrmCourse } from "../../entities/orm-entities/orm-course"

import { OrmSectionMapper } from "./orm-section-mapper"
import { OrmTrainerMapper } from "src/trainer/infraestructure/mappers/orm-mapper/orm-trainer-mapper"
import { OrmCourseTags } from "../../entities/orm-entities/orm-course-tags"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { Section } from "src/course/domain/entities/section/section"
import { CourseId } from "src/course/domain/value-objects/course-id"
import { CourseName } from "src/course/domain/value-objects/course-name"
import { CourseDescription } from "src/course/domain/value-objects/course-description"
import { CourseWeeksDuration } from "src/course/domain/value-objects/course-weeks-duration"
import { CourseMinutesDuration } from "src/course/domain/value-objects/course-minutes-duration"
import { CourseLevel } from "src/course/domain/value-objects/course-level"
import { CourseImage } from "src/course/domain/value-objects/course-image"
import { CourseTag } from "src/course/domain/value-objects/course-tag"
import { CourseDate } from "src/course/domain/value-objects/course-date"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"
import { CourseTrainer } from "src/course/domain/value-objects/course-trainer"
import { CourseCategory } from "src/course/domain/value-objects/course-category"



export class OrmCourseMapper implements IMapper<Course, OrmCourse>
{
    private readonly ormSectionMapper: OrmSectionMapper

    constructor ( ormSectionMapper: OrmSectionMapper)
    {
        this.ormSectionMapper = ormSectionMapper
    }

    async fromDomainToPersistence ( domain: Course ): Promise<OrmCourse>
    {
        let tags: OrmCourseTags[] = []
        domain.Tags.forEach(tag => {
            tags.push(OrmCourseTags.create(tag.Value))
        })
        return OrmCourse.create( domain.Id.Value, domain.Name.Value, domain.Description.Value, domain.Level.Value, domain.WeeksDuration.Value, domain.MinutesDuration.Value, domain.TrainerId.Value, domain.CategoryId.Value, domain.Image.Value, tags)
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
        let tags: CourseTag[] = []
        if (persistence.tags){
            for ( const tag of persistence.tags )
            {
                tags.push(CourseTag.create(tag.name))
            }
        }
        //TODO relacion con trainer y con categoria

        const course: Course =
            Course.create( CourseId.create(persistence.id), 
                CourseTrainer.create(TrainerId.create(persistence.trainer.id)), 
                CourseName.create(persistence.name), 
                CourseDescription.create(persistence.description), 
                CourseWeeksDuration.create(persistence.weeks_duration), 
                CourseMinutesDuration.create(persistence.minutes_per_section), 
                CourseLevel.create(persistence.level), 
                sections, 
                CourseCategory.create(CategoryId.create(persistence.category_id)), 
                CourseImage.create(persistence.image_url), 
                tags, 
                CourseDate.create(persistence.date))

        return course
    }

}