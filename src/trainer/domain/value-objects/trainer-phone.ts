import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidTrainerPhoneException } from "../exceptions/invalid-trainer-phone";

export class TrainerPhone implements IValueObject<TrainerPhone> {
    private readonly phoneNumber: string;

    get Value(): string
    {
        return this.phoneNumber;
    }

    protected constructor (phoneNumber:string) {
        const hasPhoneFormat = /^(0424|0414|0426|0416|0412)(\d{7})$/
        if (!hasPhoneFormat.test(phoneNumber)) {throw new InvalidTrainerPhoneException();}
        this.phoneNumber = phoneNumber;
    }

    equals(valueObject: TrainerPhone): boolean {
        return (this.Value === valueObject.Value);
    }

    static create (phoneNumber:string) {
        return new TrainerPhone(phoneNumber);
    }
}