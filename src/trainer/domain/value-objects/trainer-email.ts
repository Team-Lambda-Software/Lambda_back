import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidTrainerEmailException } from "../exceptions/invalid-trainer-email";

export class TrainerEmail implements IValueObject<TrainerEmail> {
    private readonly email: string;

    get Value(): string
    {
        return this.email;
    }

    protected constructor (email:string) {
        const hasEmailFormat = /^(([a-zA-Z0-9]+[\_\-]?)+([a-zA-Z0-9]\.)*)+[a-zA-Z0-9]@(([a-zA-Z0-9]\-?)*[a-zA-Z0-9]\.)+([a-zA-Z0-9]\-?)*[a-zA-Z]{2,}$/
        if (!hasEmailFormat.test(email)) {throw new InvalidTrainerEmailException();}
        this.email = email;
    }

    equals(valueObject: TrainerEmail): boolean {
        return ( this.Value === valueObject.Value );
    }

    static create (email:string) {
        return new TrainerEmail(email);
    }
}