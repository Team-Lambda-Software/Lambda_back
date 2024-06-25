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
                const trainerCreated: TrainerCreated = event as TrainerCreated
                this.name = trainerCreated.name;
                this.email = trainerCreated.email;
                this.phone = trainerCreated.phone;
                this.followers = trainerCreated.followers;
                this.location = trainerCreated.location;
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
}