

export interface GetBlogServiceResponseDto
{
    title: string
    description: string
    category: string
    images: string[]
    trainer: {
        id: string
        name: string
    }
    tags: string[]
    date: Date
}