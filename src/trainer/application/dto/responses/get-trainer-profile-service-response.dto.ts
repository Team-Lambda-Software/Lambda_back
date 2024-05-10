import { Trainer } from "src/trainer/domain/trainer";
import { Course } from "src/course/domain/course";
import { Blog } from "src/blog/domain/blog";

export interface GetTrainerProfileServiceResponseDto {
    trainer: Trainer;
    followerCount:number;
    courses:Course[];
    blogs:Blog[];
}