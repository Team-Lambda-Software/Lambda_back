import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { CourseId } from "../value-objects/course-id"
import { Trainer } from "src/trainer/domain/trainer"
import { CourseName } from "../value-objects/course-name"
import { CourseDescription } from "../value-objects/course-description"
import { CourseWeeksDuration } from "../value-objects/course-weeks-duration"
import { CourseMinutesDuration } from "../value-objects/course-minutes-duration"
import { CourseLevel } from "../value-objects/course-level"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { CourseImage } from "../value-objects/course-image"
import { CourseTag } from "../value-objects/course-tag"
import { CourseDate } from "../value-objects/course-date"
import { Section } from "../entities/section/section"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"


export class CourseCreated extends DomainEvent{
    protected constructor ( 
        public id: CourseId,
        public trainerId: TrainerId,
        public name: CourseName,
        public description: CourseDescription,
        public weeksDuration: CourseWeeksDuration,
        public minutesDuration: CourseMinutesDuration,
        public level: CourseLevel,
        public sections: Section[],
        public categoryId: CategoryId,
        public image: CourseImage,
        public tags: CourseTag[],
        public date: CourseDate)
    {
        super()
    }

    static create ( id: CourseId, trainerId: TrainerId, name: CourseName, description: CourseDescription, weeksDuration: CourseWeeksDuration, minutesDuration: CourseMinutesDuration, level: CourseLevel, sections: Section[], categoryId: CategoryId, image: CourseImage, tags: CourseTag[], date: CourseDate): CourseCreated
    {
        return new CourseCreated( id, trainerId, name, description, weeksDuration, minutesDuration, level, sections, categoryId, image, tags, date)
    }
}