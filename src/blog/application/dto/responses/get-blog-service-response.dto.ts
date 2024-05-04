import { Blog } from "src/blog/domain/blog"
import { BlogComment } from "src/blog/domain/entities/blog-comment"



export interface GetBlogServiceResponseDto
{
    blog: Blog
    comments: BlogComment[]
}