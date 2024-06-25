import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { SectionCommentDate } from "src/course/domain/entities/section-comment/value-objects/section-comment-date"
import { SectionCommentId } from "src/course/domain/entities/section-comment/value-objects/section-comment-id"
import { SectionCommentText } from "src/course/domain/entities/section-comment/value-objects/section-comment-text"
import { SectionDescription } from "src/course/domain/entities/section/value-objects/section-description"
import { SectionDuration } from "src/course/domain/entities/section/value-objects/section-duration"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { SectionName } from "src/course/domain/entities/section/value-objects/section-name"
import { SectionVideo } from "src/course/domain/entities/section/value-objects/section-video"
import { CourseCreated } from "src/course/domain/events/course-created-event"
import { SectionCommentCreated } from "src/course/domain/events/section-comment-created-event"
import { SectionCreated } from "src/course/domain/events/section-created-event"
import { CourseDate } from "src/course/domain/value-objects/course-date"
import { CourseDescription } from "src/course/domain/value-objects/course-description"
import { CourseId } from "src/course/domain/value-objects/course-id"
import { CourseImage } from "src/course/domain/value-objects/course-image"
import { CourseLevel } from "src/course/domain/value-objects/course-level"
import { CourseMinutesDuration } from "src/course/domain/value-objects/course-minutes-duration"
import { CourseName } from "src/course/domain/value-objects/course-name"
import { CourseTag } from "src/course/domain/value-objects/course-tag"
import { CourseWeeksDuration } from "src/course/domain/value-objects/course-weeks-duration"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"
import { UserId } from "src/user/domain/value-objects/user-id"



export class CourseDomainEventObjectMother {


    static createCourseCreatedEvent(): CourseCreated {
        return CourseCreated.create(
            CourseId.create('c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
            TrainerId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            CourseName.create('title'),
            CourseDescription.create('description of the course'),
            CourseWeeksDuration.create(10),
            CourseMinutesDuration.create(60),
            CourseLevel.create(2),
            [],
            CategoryId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            CourseImage.create('url.com'),
            [CourseTag.create('Tag')],
            CourseDate.create(new Date())
        )
    }

    static createSectionCommentCreatedEvent(userId: string, courseId: string, sectionId: string): SectionCommentCreated {
        return SectionCommentCreated.create(
            SectionCommentId.create('c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
            UserId.create(userId),
            SectionCommentText.create('texts of the comment'),
            SectionCommentDate.create(new Date()),
            SectionId.create(sectionId),
            CourseId.create(courseId)
        )
    }

    static createSectionCreatedEvent(courseId: string): SectionCreated {
        return SectionCreated.create(
            SectionId.create('c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1'),
            SectionName.create('section name'),
            SectionDescription.create('section description'),
            SectionDuration.create(60),
            SectionVideo.create('url.com'),
            CourseId.create(courseId)
        )
    }
}