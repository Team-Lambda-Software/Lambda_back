import { Blog } from "src/blog/domain/blog"
import { BlogBody } from "src/blog/domain/value-objects/blog-body"
import { BlogId } from "src/blog/domain/value-objects/blog-id"
import { BlogImage } from "src/blog/domain/value-objects/blog-image"
import { BlogPublicationDate } from "src/blog/domain/value-objects/blog-publication-date"
import { BlogTag } from "src/blog/domain/value-objects/blog-tag"
import { BlogTitle } from "src/blog/domain/value-objects/blog-title"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { Trainer } from "src/trainer/domain/trainer"
import { TrainerId } from "src/trainer/domain/value-objects/trainer-id"
import { ReadModelObjectMother } from "./read-model.object-model"
import { Model } from "mongoose"
import { OdmBlogEntity } from "src/blog/infraestructure/entities/odm-entities/odm-blog.entity"
import { OdmCategoryEntity } from "src/categories/infraesctructure/entities/odm-entities/odm-category.entity"
import { OdmTrainerEntity } from "src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity"
import { BlogTrainer } from "src/blog/domain/value-objects/blog-trainer"
import { BlogCategory } from "src/blog/domain/value-objects/blog-category"


export class BlogObjectMother {
    
    private readonly blogModel: Model<OdmBlogEntity>
    private readonly categoryModel: Model<OdmCategoryEntity>
    private readonly trainerModel: Model<OdmTrainerEntity>

    constructor(blogModel: Model<OdmBlogEntity>, categoryModel: Model<OdmCategoryEntity>, trainerModel: Model<OdmTrainerEntity>){
        this.blogModel = blogModel
        this.categoryModel = categoryModel
        this.trainerModel = trainerModel
    }

    static async createBlog(){
        return Blog.create(
            BlogId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            BlogTitle.create('Title'),
            BlogBody.create('Body body'),
            [BlogImage.create('www.example.com')],
            BlogPublicationDate.create(new Date()),
            BlogTrainer.create(TrainerId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7')),
            BlogCategory.create(CategoryId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7')),
            [BlogTag.create('Tag')]
        )
    }

    createOdmBlog(){

        
        const odmBlog = new this.blogModel({
            id: 'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7',
            title: 'Title',
            body: 'Body body',
            publication_date: new Date(),
            category: new this.categoryModel({id: 'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7', categoryName: 'Category', icon: 'www.icon.com'}),
            trainer: new this.trainerModel({id: 'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7', first_name: 'john', first_last_name: 'doe', second_last_name: 'doe', email: 'example@gmail.com', phone: '04166138440', latitude: '10.0000', longitude: '10.0000', followers: []}),
            images: [],
            tags: ['tag']
        })

        return odmBlog
    }
}