import mongoose from "mongoose"
import { BlogCommentSchema } from "src/blog/infraestructure/entities/odm-entities/odm-blog-comment.entity"
import { BlogSchema } from "src/blog/infraestructure/entities/odm-entities/odm-blog.entity"
import { CategorySchema } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { CourseSchema } from "src/course/infraestructure/entities/odm-entities/odm-course.entity"
import { SectionCommentSchema } from "src/course/infraestructure/entities/odm-entities/odm-section-comment.entity"
import { TrainerSchema } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import {UserSchema } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"



export class ReadModelObjectMother{

    getUserModel (){
        return mongoose.model('User', UserSchema);
    }

    getBlogModel (){
        return mongoose.model('Blog', BlogSchema)
    }

    getCategoryModel (){
        return mongoose.model('Category', CategorySchema)
    }

    getTrainerModel (){
        return mongoose.model('Trainer', TrainerSchema)
    }

    getBlogCommentModel (){
        return mongoose.model('BlogComment', BlogCommentSchema)
    }

    getCourseModel (){
        return mongoose.model('Course', CourseSchema)
    }

    getSectionCommentModel (){
        return mongoose.model('SectionComment', SectionCommentSchema)
    }

}