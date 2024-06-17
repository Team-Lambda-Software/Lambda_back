import { Entity } from "src/common/Domain/entity/entity"
import { BlogCommentId } from "./value-objects/blog-comment-id"
import { BlogCommentText } from "./value-objects/blog-comment-text"
import { BlogCommentDate } from "./value-objects/blog-comment-date"
import { BlogId } from "../value-objects/blog-id"
import { InvalidBlogCommentException } from "./exceptions/invalid-blog-comment-exception"




export class BlogComment extends Entity<BlogCommentId>
{

    private userId: string
    private text: BlogCommentText
    private date: BlogCommentDate
    private blogId: BlogId

    get UserId ()
    {
        return this.userId
    }

    get Text ()
    {
        return this.text
    }

    get Date ()
    {
        return this.date
    }

    get BlogId ()
    {
        return this.blogId
    }

    protected constructor ( id: BlogCommentId, userId: string, text: BlogCommentText, date: BlogCommentDate, blogId: BlogId )
    {
        super( id )
        this.userId = userId
        this.text = text
        this.date = date
        this.blogId = blogId
        this.ensureValidState()
    }

    protected ensureValidState (): void
    {
        if ( !this.userId || !this.text || !this.blogId || !this.date)
            throw new InvalidBlogCommentException()

    }

    static create ( id: BlogCommentId, userId: string, text: BlogCommentText, date: BlogCommentDate, blogId: BlogId ): BlogComment
    {
        return new BlogComment( id, userId, text, date, blogId)
    }

}