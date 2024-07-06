import { DomainEvent } from "src/common/Domain/domain-event/domain-event"

export class TrainerFollowed extends DomainEvent {
    protected constructor(
        public trainerId: string,
        public userId: string
    )
    {
        super();
    }

    static create( trainerId:string, userId:string ): TrainerFollowed
    {
        return new TrainerFollowed(trainerId, userId);
    }
}