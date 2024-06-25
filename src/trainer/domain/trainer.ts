import { AggregateRoot } from "src/common/Domain/aggregate-root/aggregate-root";
import { TrainerId } from "./value-objects/trainer-id";
import { TrainerName } from "./value-objects/trainer-name";
import { TrainerEmail } from "./value-objects/trainer-email";
import { TrainerPhone } from "./value-objects/trainer-phone";
import { TrainerFollowers } from "./value-objects/trainer-followers";
import { TrainerLocation } from "./value-objects/trainer-location";
import { DomainEvent } from "src/common/Domain/domain-event/domain-event";
import { TrainerCreated } from "./events/trainer-created-event";
import { InvalidTrainerException } from "./exceptions/invalid-trainer";
import { UserId } from "src/user/domain/value-objects/user-id";
import { Result } from "src/common/Domain/result-handler/Result";
import { TrainerFollowed } from "./events/trainer-followed-event";
import { TrainerUnfollowed } from "./events/trainer-unfollowed-event";
import { CannotFollowTrainerException } from "./exceptions/cannot-follow-trainer";
import { CannotUnfollowTrainerException } from "./exceptions/cannot-unfollow-trainer";

export class Trainer extends AggregateRoot<TrainerId> {
    private name: TrainerName;
    private email: TrainerEmail;
    private phone: TrainerPhone;
    private followers: TrainerFollowers;
    private location?: TrainerLocation;

    get Name(): TrainerName
    {
        return (TrainerName.create(this.name.FirstName, this.name.FirstLastName, this.name.SecondLastName));
    }

    get Email(): TrainerEmail
    {
        return (TrainerEmail.create(this.email.Value));
    }

    get Phone(): TrainerPhone
    {
        return (TrainerPhone.create(this.phone.Value));
    }

    get FollowersID(): TrainerFollowers
    {
        return (TrainerFollowers.create(this.followers.Value));
    }

    get Location(): TrainerLocation | undefined //to-do A value-object may be undefined?
    {
        if (this.location === undefined) { return undefined; }
        return (TrainerLocation.create(this.location.Latitude, this.location.Longitude));
    }

    protected constructor (id: TrainerId, name:TrainerName, email:TrainerEmail, phone:TrainerPhone, followers: TrainerFollowers, location?: TrainerLocation)
    {
        const trainerCreated: TrainerCreated = TrainerCreated.create( id, name, email, phone, followers, location);
        super(id, trainerCreated);
    }

    protected applyEvent(event: DomainEvent): void {
        switch (event.eventName) { //to-do Model the other domain events
            case 'TrainerCreated':
                const trainerCreated: TrainerCreated = event as TrainerCreated;
                this.name = trainerCreated.name;
                this.email = trainerCreated.email;
                this.phone = trainerCreated.phone;
                this.followers = trainerCreated.followers;
                this.location = trainerCreated.location;
                break;
            case 'TrainerFollowed':
                const trainerFollowed: TrainerFollowed = event as TrainerFollowed;
                this.updateAddedFollower(trainerFollowed.userId);
                break;
            case 'TrainerUnfollowed':
                const trainerUnfollowed: TrainerUnfollowed = event as TrainerUnfollowed;
                this.updateRemovedFollower(trainerUnfollowed.userId);
                break;
        }
    }

    protected ensureValidState(): void {
        if ( !this.name || !this.email || !this.followers || !this.phone )
        {
            throw new InvalidTrainerException();
        }
    }

    static create (id: TrainerId, name:TrainerName, email:TrainerEmail, phone:TrainerPhone, followers: TrainerFollowers, location?: TrainerLocation): Trainer
    {
        return new Trainer(id, name, email, phone, followers, location);
    }

    private updateAddedFollower(userId: UserId): void
    {
        let followersID:UserId[] = this.FollowersID.Value; //Get copy of current Value-object
        followersID.push(userId);
        this.followers = TrainerFollowers.create(followersID);
    }

    private updateRemovedFollower(userId:UserId): void
    {
        let followersID:UserId[] = this.FollowersID.Value; //Get copy of current Value-object
        let updatedFollowers:UserId[] = [];
        for (let follower of followersID)
        {
            if (!follower.equals(userId))
            {
                updatedFollowers.push(follower);
            }
        }
        this.followers = TrainerFollowers.create(updatedFollowers);
    }

    public addFollower(userId: UserId):Result<void>
    {
        let followersID:UserId[] = this.FollowersID.Value;
        let isIncluded:boolean = false;
        for (let follower of followersID)
        {
            if (follower.equals(userId))
            {
                isIncluded = true;
                break;
            }
        }
        if (isIncluded) //User is already following this trainer. Cannot add
        {
            return Result.fail<void>(new CannotFollowTrainerException(), 409, "El usuario ya se encuentra siguiendo al entrenador. No puede suscribirse nuevamente");
        }
        else //May follow the desired trainer
        {
            this.onEvent(TrainerFollowed.create(this.Id, userId));
            return Result.success<void>( undefined, 200 );
        }
    }

    public removeFollower(userId:UserId):Result<void>
    {
        let followersID:UserId[] = this.FollowersID.Value;
        let isIncluded:boolean = false;
        for (let follower of followersID)
        {
            if (follower.equals(userId))
            {
                isIncluded = true;
                break;
            }
        }
        if (!isIncluded) //User is not following this trainer. Cannot remove
        {
            return Result.fail<void>(new CannotUnfollowTrainerException(), 409, "El usuario no se encuentra siguiendo al entrenador. No puede desuscribirse nuevamente");
        }
        else //May unfollow the desired trainer
        {
            this.onEvent(TrainerUnfollowed.create(this.Id, userId));
            return Result.success<void>( undefined, 200 );
        }
    }
}