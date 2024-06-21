import { OdmCourseEntity } from "../../entities/odm-entities/odm-course.entity"
import { IMapper } from "src/common/Application/mapper/mapper.interface"
import { Course } from "src/course/domain/course"
import { CourseId } from "src/course/domain/value-objects/course-id"
import { CourseName } from "src/course/domain/value-objects/course-name"
import { CourseDescription } from "src/course/domain/value-objects/course-description"
import { CourseWeeksDuration } from "src/course/domain/value-objects/course-weeks-duration"
import { CourseMinutesDuration } from "src/course/domain/value-objects/course-minutes-duration"
import { CourseLevel } from "src/course/domain/value-objects/course-level"
import { CourseImage } from "src/course/domain/value-objects/course-image"
import { CourseTag } from "src/course/domain/value-objects/course-tag"
import { CourseDate } from "src/course/domain/value-objects/course-date"
import { Trainer } from "src/trainer/domain/trainer"
import { Section } from "src/course/domain/entities/section/section"
import { SectionVideo } from "src/course/domain/entities/section/value-objects/section-video"
import { SectionDescription } from "src/course/domain/entities/section/value-objects/section-description"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { SectionName } from "src/course/domain/entities/section/value-objects/section-name"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { SectionDuration } from "src/course/domain/entities/section/value-objects/section-duration"


export class OdmCourseMapper implements IMapper<Course, OdmCourseEntity>
{
    fromDomainToPersistence ( domain: Course ): Promise<OdmCourseEntity>
    {
        throw new Error( "Method not implemented." )
    }
    async fromPersistenceToDomain ( course: OdmCourseEntity ): Promise<Course>
    {
        return Course.create(CourseId.create(course.id), 
            Trainer.create(course.trainer.id, course.trainer.first_name, course.trainer.first_last_name, 
            course.trainer.second_last_name, course.trainer.email, course.trainer.phone, 
            course.trainer.followers.map(follower => follower.id)),
            CourseName.create(course.name), 
            CourseDescription.create(course.description),
            CourseWeeksDuration.create(course.weeks_duration), 
            CourseMinutesDuration.create(course.minutes_per_section), 
            CourseLevel.create(course.level), course.sections.map(section => 
                Section.create(SectionId.create(section.id), SectionName.create(section.name), 
                SectionDescription.create(section.description), SectionDuration.create(section.duration), 
                SectionVideo.create(section.video))), CategoryId.create(course.category.id), 
            CourseImage.create(course.image), course.tags.map(tag => CourseTag.create(tag)), 
            CourseDate.create(course.date))
    }
    
}