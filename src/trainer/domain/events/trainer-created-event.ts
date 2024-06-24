import { DomainEvent } from "src/common/Domain/domain-event/domain-event";
import { TrainerId } from "../value-objects/trainer-id";
import { TrainerName } from "../value-objects/trainer-name";
import { TrainerEmail } from "../value-objects/trainer-email";
import { TrainerPhone } from "../value-objects/trainer-phone";
import { TrainerFollowers } from "../value-objects/trainer-followers";
import { TrainerLocation } from "../value-objects/trainer-location";

export class TrainerCreated extends DomainEvent {
    protected constructor (
        public id: TrainerId,
        public name: TrainerName,
        public email: TrainerEmail,
        public phone: TrainerPhone,
        public followers: TrainerFollowers,
        public location?: TrainerLocation
        )
    {
        super();
    }

    static create (id: TrainerId, name:TrainerName, email:TrainerEmail, phone:TrainerPhone, followers: TrainerFollowers, location?: TrainerLocation): TrainerCreated
    {
        return new TrainerCreated( id, name, email, phone, followers, location);
    }
}