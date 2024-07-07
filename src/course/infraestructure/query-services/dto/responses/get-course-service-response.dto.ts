



export interface GetCourseServiceResponseDto {

    id: string
    title: string
    description: string
    category: string
    image: string
    trainer: {
        id: string
        name: string
    }
    level: number
    durationWeeks: number
    durationMinutes: number
    tags: string[]
    date: Date
    lessons: {
        id: string
        title: string
        content: string
        video: string
    }[]

}