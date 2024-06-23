import { Blog } from "src/blog/domain/blog"
import { BlogBody } from "src/blog/domain/value-objects/blog-body"
import { BlogId } from "src/blog/domain/value-objects/blog-id"
import { BlogImage } from "src/blog/domain/value-objects/blog-image"
import { BlogPublicationDate } from "src/blog/domain/value-objects/blog-publication-date"
import { BlogTag } from "src/blog/domain/value-objects/blog-tag"
import { BlogTitle } from "src/blog/domain/value-objects/blog-title"
import { CategoryId } from "src/categories/domain/value-objects/category-id"
import { Trainer } from "src/trainer/domain/trainer"


export class BlogObjectMother {
    
    static async createBlog(){
        return Blog.create(
            BlogId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            BlogTitle.create('Title'),
            BlogBody.create('Body body'),
            [BlogImage.create('www.example.com')],
            BlogPublicationDate.create(new Date()),
            Trainer.create(
                'cb0e2f2c-1326-428e-9fd4-b7822ff94ab7',
                'Name',
                'Lastname',
                'doe',
                'example@gmail.com',
                '041234567',
                []
            ),
            CategoryId.create('cb0e2f2c-1326-428e-9fd4-b7822ff94ab7'),
            [BlogTag.create('Tag')]
        )
    }
}