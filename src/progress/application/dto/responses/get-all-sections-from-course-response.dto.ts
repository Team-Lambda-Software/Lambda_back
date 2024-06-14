export interface GetAllSectionsFromCourseResponseDto
{
    completionPercent:number;
    sections: Array<{id:string, videoSecond:number, completionPercent:number}>;
}