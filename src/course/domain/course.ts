import { Trainer } from "src/trainer/domain/trainer"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { AggregateRoot } from "src/common/Domain/aggregate-root/aggregate-root"
import { CourseId } from "./value-objects/course-id"
import { CourseName } from "./value-objects/course-name"
import { CourseDescription } from "./value-objects/course-description"
import { CourseWeeksDuration } from "./value-objects/course-weeks-duration"
import { CourseMinutesDuration } from "./value-objects/course-minutes-duration"
import { CourseLevel } from "./value-objects/course-level"
import { CourseImage } from "./value-objects/course-image"
import { CourseTag } from "./value-objects/course-tag"
import { CourseDate } from "./value-objects/course-date"
import { InvalidCourseException } from "./exceptions/invalid-course-exception"
import { DomainEvent } from "src/common/Domain/domain-event/domain-event"
import { CourseCreated } from "./events/course-created-event"
import { Section } from "./entities/section/section"
import { SectionCommentId } from "./entities/section-comment/value-objects/section-comment-id"
import { SectionComment } from "./entities/section-comment/section-comment"
import { SectionCommentText } from "./entities/section-comment/value-objects/section-comment-text"
import { SectionCommentDate } from "./entities/section-comment/value-objects/section-comment-date"
import { SectionCommentCreated } from "./events/section-comment-created-event"
import { SectionId } from "./entities/section/value-objects/section-id"
import { SectionName } from "./entities/section/value-objects/section-name"
import { SectionDescription } from "./entities/section/value-objects/section-description"
import { SectionDuration } from "./entities/section/value-objects/section-duration"
import { SectionVideo } from "./entities/section/value-objects/section-video"
import { SectionCreated } from "./events/section-created-event"
import { UserId } from "src/user/domain/value-objects/user-id"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"




export class Course extends AggregateRoot<CourseId>
{
    

    private trainerId: TrainerId
    private name: CourseName
    private description: CourseDescription
    private weeksDuration: CourseWeeksDuration
    private minutesDuration: CourseMinutesDuration //esto es lo que significa el tiempo que aparece en el figma?
    private level: CourseLevel
    private categoryId: CategoryId
    private sections: Section[]
    private image: CourseImage
    private tags: CourseTag[]
    private date: CourseDate
    
    
    get Tags (): CourseTag[]
    {
        return this.tags
    }

    get TrainerId (): TrainerId
    {
        return this.trainerId
    }

    get Name (): CourseName
    {
        return this.name
    }

    get Description (): CourseDescription
    {
        return this.description
    }

    get WeeksDuration (): CourseWeeksDuration
    {
        return this.weeksDuration
    }

    get MinutesDuration (): CourseMinutesDuration
    {
        return this.minutesDuration
    }

    get Level (): CourseLevel
    {
        return this.level
    }

    get CategoryId (): CategoryId
    {
        return this.categoryId
    }

    get Sections (): Section[]
    {
        return this.sections
    }

    get Image (): CourseImage
    {
        return this.image
    }

    get Date (): CourseDate
    {
        return this.date
    }

    protected constructor ( id: CourseId, trainerId: TrainerId, name: CourseName, description: CourseDescription, weeksDuration: CourseWeeksDuration, minutesDuration: CourseMinutesDuration, level: CourseLevel, sections: Section[], categoryId: CategoryId, image: CourseImage, tags: CourseTag[], date: CourseDate)
    {
        const courseCreated: CourseCreated = CourseCreated.create( 
            id.Value, trainerId.Value, 
            name.Value, description.Value, 
            weeksDuration.Value, minutesDuration.Value, 
            level.Value, sections.map( section =>{ return {id: section.Id.Value, 
                name: section.Name.Value, 
                description: section.Description.Value,
                duration: section.Duration.Value,
                video: section.Video.Value}}), categoryId.Value, image.Value, tags.map(tag => tag.Value), date.Value)
        super( id, courseCreated)
        
    }

    protected applyEvent ( event: DomainEvent ): void
    {
        switch ( event.eventName ){
            case 'CourseCreated':
                const courseCreated: CourseCreated = event as CourseCreated
                this.trainerId = TrainerId.create(courseCreated.trainerId)
                this.name = CourseName.create(courseCreated.name)
                this.description = CourseDescription.create(courseCreated.description)
                this.weeksDuration = CourseWeeksDuration.create(courseCreated.weeksDuration)
                this.minutesDuration = CourseMinutesDuration.create(courseCreated.minutesDuration)
                this.level = CourseLevel.create(courseCreated.level)
                this.sections = courseCreated.sections.map( section => Section.create(SectionId.create(section.id), SectionName.create(section.name), SectionDescription.create(section.description), SectionDuration.create(section.duration), SectionVideo.create(section.video)))
                this.categoryId = CategoryId.create(courseCreated.categoryId)
                this.image = CourseImage.create(courseCreated.image)
                this.tags = courseCreated.tags.map(tag => CourseTag.create(tag))
                this.date = CourseDate.create(courseCreated.date)

                
        }
    }

    protected ensureValidState (): void
    {
        if ( !this.trainerId || !this.name || !this.description || !this.weeksDuration || !this.minutesDuration || !this.level || !this.sections || !this.categoryId || !this.image || !this.tags || !this.date )
            throw new InvalidCourseException()
    }

    changeSections ( sections: Section[] ): void
    {
        this.sections = sections
    }

    public getSectionDuration (sectionId: SectionId){
        const section = this.sections.find( section => section.Id.equals(sectionId))
        return section.Duration
    }

    public createComment (id: SectionCommentId, userId: UserId, text: SectionCommentText, date: SectionCommentDate, sectionId: SectionId): SectionComment{
        const comment: SectionComment = SectionComment.create(id, userId, text, date, sectionId)
        const sectionCommentCreated: SectionCommentCreated = SectionCommentCreated.create(id.Value, userId.Id, text.Value, date.Value, sectionId.Value,this.Id.Value)
        this.onEvent(sectionCommentCreated)
        return comment
    }

    public createSection ( id: SectionId, name: SectionName, description: SectionDescription, duration: SectionDuration, video: SectionVideo ): Section{
        const section: Section = Section.create( id, name, description, duration, video)
        const sectionCreated: DomainEvent = SectionCreated.create( id.Value, name.Value, description.Value, duration.Value, video.Value, this.Id.Value)
        this.sections.push(section)
        this.onEvent(sectionCreated)
        return section
    }

    static create ( id: CourseId, trainerId: TrainerId, name: CourseName, description: CourseDescription, weeksDuration: CourseWeeksDuration, minutesDuration: CourseMinutesDuration, level: CourseLevel, sections: Section[], categoryId: CategoryId, image: CourseImage, tags: CourseTag[], date: CourseDate): Course
    {
        return new Course( id, trainerId, name, description, weeksDuration, minutesDuration, level, sections, categoryId, image, tags, date)
    }

}