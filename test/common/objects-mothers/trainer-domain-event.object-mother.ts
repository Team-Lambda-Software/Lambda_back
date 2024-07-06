import { TrainerFollowed } from "src/trainer/domain/events/trainer-followed-event"
import { TrainerUnfollowed } from "src/trainer/domain/events/trainer-unfollowed-event"



export class TrainerDomainEventObjectMother {
    static FollowTrainerDomainEvent(trainerId: string,userId: string): TrainerFollowed {
        return TrainerFollowed.create(
            trainerId,
            userId
        )
    }

    static UnfollowTrainerDomainEvent(trainerId: string,userId: string): TrainerUnfollowed {
        return TrainerUnfollowed.create(
            trainerId,
            userId
        )
    }
}