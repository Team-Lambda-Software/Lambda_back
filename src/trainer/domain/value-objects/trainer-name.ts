import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidTrainerNameException } from "../exceptions/invalid-trainer-name";

export class TrainerName implements IValueObject<TrainerName> {
    private readonly firstName: string;
    private readonly firstLastName: string;
    private readonly secondLastName: string;

    protected constructor (firstName: string, firstLastName: string, secondLastName: string)
    {
        if (!firstName) { throw new InvalidTrainerNameException(); }
        if (!firstLastName) { throw new InvalidTrainerNameException(); }
        if (!secondLastName) { throw new InvalidTrainerNameException(); }

        const isOnlyLettersAndSingleWord = /^[a-zA-Z]+$/
        if (!isOnlyLettersAndSingleWord.test(firstName)) { throw new InvalidTrainerNameException(); }
        if (!isOnlyLettersAndSingleWord.test(firstLastName)) { throw new InvalidTrainerNameException(); }
        if (!isOnlyLettersAndSingleWord.test(secondLastName)) { throw new InvalidTrainerNameException(); }

        this.firstName = firstName;
        this.firstLastName = firstLastName;
        this.secondLastName = secondLastName;
    }

    equals(valueObject: TrainerName): boolean {
        if (this.FirstName != valueObject.FirstName) { return false; }
        if (this.FirstLastName != valueObject.FirstLastName) { return false; }
        if (this.SecondLastName != valueObject.SecondLastName) { return false; }
        return true;
    }

    get FirstName(): string
    {
        return this.firstName;
    }

    get FirstLastName(): string
    {
        return this.firstLastName;
    }

    get SecondLastName(): string
    {
        return this.secondLastName;
    }

    static create (firstName: string, firstLastName: string, secondLastName: string) {
        return new TrainerName(firstName, firstLastName, secondLastName);
    }
}