import { Model } from "mongoose"
import { OdmBlogEntity } from "src/blog/infraestructure/entities/odm-entities/odm-blog.entity"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { Course } from "src/course/domain/course"
import { Section } from "src/course/domain/entities/section/section"
import { SectionDescription } from "src/course/domain/entities/section/value-objects/section-description"
import { SectionDuration } from "src/course/domain/entities/section/value-objects/section-duration"
import { SectionId } from "src/course/domain/entities/section/value-objects/section-id"
import { SectionName } from "src/course/domain/entities/section/value-objects/section-name"
import { SectionVideo } from "src/course/domain/entities/section/value-objects/section-video"
import { CourseCategory } from "src/course/domain/value-objects/course-category"
import { CourseDate } from "src/course/domain/value-objects/course-date"
import { CourseDescription } from "src/course/domain/value-objects/course-description"
import { CourseId } from "src/course/domain/value-objects/course-id"
import { CourseImage } from "src/course/domain/value-objects/course-image"
import { CourseLevel } from "src/course/domain/value-objects/course-level"
import { CourseMinutesDuration } from "src/course/domain/value-objects/course-minutes-duration"
import { CourseName } from "src/course/domain/value-objects/course-name"
import { CourseTag } from "src/course/domain/value-objects/course-tag"
import { CourseTrainer } from "src/course/domain/value-objects/course-trainer"
import { CourseWeeksDuration } from "src/course/domain/value-objects/course-weeks-duration"
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity"
import { Trainer } from "src/trainer/domain/trainer"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"



export class CourseObjectMother{

    private readonly courseModel: Model<OdmCourseEntity>
    private readonly categoryModel: Model<OdmCategoryEntity>
    private readonly trainerModel: Model<OdmTrainerEntity>

    constructor(courseModel: Model<OdmCourseEntity>, categoryModel: Model<OdmCategoryEntity>, trainerModel: Model<OdmTrainerEntity>){
        this.courseModel = courseModel
        this.categoryModel = categoryModel
        this.trainerModel = trainerModel
    }

    static async createCourse(){
        return Course.create(
            CourseId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            CourseTrainer.create(TrainerId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab9')),
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
            CourseCategory.create(CategoryId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7')),
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

    async createOdmCourse(){
        return new this.courseModel({
            id: 'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7',
            title: 'Title',
            description: 'Body body',
            weeks_duration: 5,
            minutes_duration: 60,
            level: 2,
            sections: [{
                id: 'cb0e2f2c-1326-428e-9fd4-b7822ff95ab7',
                name: 'Section 1',
                description: 'Description 1',
                duration: 60,
                video: 'www.example.com'
            }],
            image: 'www.example.com',
            category: new this.categoryModel({id: 'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7', categoryName: 'Category', icon: 'www.icon.com'}),
            trainer: new this.trainerModel({id: 'cb0e2f2c-1326-428e-9fd4-b7822ff94ab9', first_name: 'john', first_last_name: 'doe', second_last_name: 'doe', email: 'example@gmail.com', phone: '04166138440', latitude: '10.0000', longitude: '10.0000', followers: []}),
        })
    }


}