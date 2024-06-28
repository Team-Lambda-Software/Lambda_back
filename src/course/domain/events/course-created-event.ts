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
        public id: string,
        public trainerId: string,
        public name: string,
        public description: string,
        public weeksDuration: number,
        public minutesDuration: number,
        public level: number,
        public sections: {id: string, name: string, description:string, duration:number, video:string}[],
        public categoryId: string,
        public image: string,
        public tags: string[],
        public date: Date)
    {
        super()
    }

    static create ( id: string, trainerId: string, name: string, description: string, weeksDuration: number, minutesDuration: number, level: number, sections: {id: string, name: string, description:string, duration:number, video:string}[], categoryId: string, image: string, tags: string[], date: Date): CourseCreated
    {
        return new CourseCreated( id, trainerId, name, description, weeksDuration, minutesDuration, level, sections, categoryId, image, tags, date)
    }
}