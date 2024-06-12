import { Trainer } from "src/trainer/domain/trainer";
import { Course } from "src/course/domain/course";
import { Blog } from "src/blog/domain/blog";

export interface GetTrainerProfileServiceResponseDto {
    trainerName: string;
    trainerId:string;
    followerCount:number;
    doesUserFollow:boolean;
    trainerLocation:string;
    //unused According to the specifications of the common API, this data will not be required
    // courses:Course[];
    // blogs:Blog[];
}