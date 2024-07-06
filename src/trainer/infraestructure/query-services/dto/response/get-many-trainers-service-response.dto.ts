
export interface GetManyTrainersServiceResponseDto
{
    trainers: {
        id: string;
        name: string;
        location: string;
        followerCount: number;
        doesUserFollow: boolean;
    }[];
}