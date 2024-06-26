
export interface GetTrainerServiceResponseDto {
    trainerName: string;
    trainerId: string;
    followerCount: number;
    doesUserFollow: boolean;
    trainerLocation: string;
}