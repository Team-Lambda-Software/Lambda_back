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


    static createCourseCreatedEvent(trainerId: string, categoryId: string): CourseCreated {
        return CourseCreated.create(
            'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1',
            trainerId,
            'title',
            'description of the course',
            10,
            60,
            2,
            [],
            categoryId,
            'url.com',
            ['Tag'],
            new Date()
        )
    }

    static createSectionCommentCreatedEvent(userId: string, courseId: string, sectionId: string): SectionCommentCreated {
        return SectionCommentCreated.create(
            'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1',
            userId,
            'texts of the comment',
            new Date(),
            sectionId,
            courseId
        )
    }

    static createSectionCreatedEvent(courseId: string): SectionCreated {
        return SectionCreated.create(
            'c1b1c1b1-c1b1-c1b1-c1b1-c1b1c1b1c1b1',
            'section name',
            'section description',
            60,
            'url.com',
            courseId
        )
    }
}