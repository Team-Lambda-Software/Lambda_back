import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { Course } from "src/course/domain/course"
import { Section } from "src/course/domain/entities/section/section"
import { SectionDescription } from "src/course/domain/entities/section/value-objects/section-description"
import { SectionDuration } from "src/course/domain/entities/section/value-objects/section-duration"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { SectionName } from "src/course/domain/entities/section/value-objects/section-name"
import { SectionVideo } from "src/course/domain/entities/section/value-objects/section-video"
import { CourseDate } from "src/course/domain/value-objects/course-date"
import { CourseDescription } from "src/course/domain/value-objects/course-description"
import { CourseId } from "src/course/domain/value-objects/course-id"
import { CourseImage } from "src/course/domain/value-objects/course-image"
import { CourseLevel } from "src/course/domain/value-objects/course-level"
import { CourseMinutesDuration } from "src/course/domain/value-objects/course-minutes-duration"
import { CourseName } from "src/course/domain/value-objects/course-name"
import { CourseTag } from "src/course/domain/value-objects/course-tag"
import { CourseWeeksDuration } from "src/course/domain/value-objects/course-weeks-duration"
import { Trainer } from "src/trainer/domain/trainer"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"



export class CourseObjectMother{
    static async createCourse(){
        return Course.create(
            CourseId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            TrainerId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab9'),
            CourseName.create('Title'),
            CourseDescription.create('Body body'),
            CourseWeeksDuration.create(5),
            CourseMinutesDuration.create(60),
            CourseLevel.create(2),
            [Section.create(
                SectionId.create('cb0e2f2c-1326-428e-9fd4-b7822ff95ab7'),
                SectionName.create('Section 1'),
                SectionDescription.create('Description 1'),
                SectionDuration.create(60),
                SectionVideo.create('www.example.com')
            )],
            CategoryId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            CourseImage.create('www.example.com'),
            [CourseTag.create('Tag')],
            CourseDate.create(new Date())
        )
    }

    static async createSection (){
        return Section.create(
            SectionId.create('cb0e2f2c-1326-428e-9fd4-b7822ff95ab7'),
            SectionName.create('Section 1'),
            SectionDescription.create('Description 1'),
            SectionDuration.create(60),
            SectionVideo.create('www.example.com')
        )
    }
}