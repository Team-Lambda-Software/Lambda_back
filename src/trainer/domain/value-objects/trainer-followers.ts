import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { UserId } from "src/user/domain/value-objects/user-id";

export class TrainerFollowers implements IValueObject<TrainerFollowers> {
    private readonly followersId: Array<UserId>

    get Value(): Array<UserId>
    {
        return this.followersId;
    }

    protected constructor (followers:Array<UserId>) {
        this.followersId = followers;
    }

    equals(valueObject: TrainerFollowers): boolean {
        let otherFollowers:Array<UserId> = valueObject.Value;
        let isEqual:boolean;
        for (let follower of this.Value)
        {
            isEqual = false;
            otherFollowers.forEach(otherFollower => isEqual = isEqual || otherFollower.equals(follower));
            if (!isEqual) { break; }
        }
        return isEqual;
    }

    static create (followers:Array<UserId>)
    {
        return new TrainerFollowers(followers);
    }
}