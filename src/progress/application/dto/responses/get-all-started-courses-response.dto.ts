export interface GetAllStartedCoursesResponseDto
{
    courses: Array<
        {
            id: string,
            title: string,
            image:string,
            date: Date,
            category: string,
            trainerName: string,
            completionPercent: number
        }>;
}