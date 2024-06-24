import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { OdmBlogCommentEntity } from "src/blog/infraestructure/entities/odm-entities/odm-blog-comment.entity"
import { OdmBlogEntity } from "src/blog/infraestructure/entities/odm-entities/odm-blog.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity"
import { OdmSectionCommentEntity } from "src/course/infraestructure/entities/odm-entities/odm-section-comment.entity"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { OdmUserEntity } from "src/user/infraestructure/entities/odm-entities/odm-user.entity"



export class ReadModelObjectMother{

    @InjectModel('Blog') 
    private readonly blogModel: Model<OdmBlogEntity>

    @InjectModel('Category') 
    private readonly categoryModel: Model<OdmCategoryEntity>

    @InjectModel('Trainer') 
    private readonly trainerModel: Model<OdmTrainerEntity>

    @InjectModel('BlogComment') 
    private readonly blogCommentModel: Model<OdmBlogCommentEntity>

    @InjectModel('User') 
    private readonly userModel: Model<OdmUserEntity>

    @InjectModel( 'Course' ) 
    private readonly courseModel: Model<OdmCourseEntity>
    
    @InjectModel( 'SectionComment' ) 
    private readonly sectionCommentModel: Model<OdmSectionCommentEntity>

    getUserModel (){
        return this.userModel
    }

    getBlogModel (){
        return this.blogModel
    }

    getCategoryModel (){
        return this.categoryModel
    }

    getTrainerModel (){
        return this.trainerModel
    }

    getBlogCommentModel (){
        return this.blogCommentModel
    }

    getCourseModel (){
        return this.courseModel
    }

    getSectionCommentModel (){
        return this.sectionCommentModel
    }

}