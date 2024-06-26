import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidTrainerIdException } from "../exceptions/invalid-trainer-id";

export class TrainerId implements IValueObject<TrainerId> {
    private readonly id:string;

    get Value(){ return this.id; }

    protected constructor (id:string){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');
        if (!regex.test(id)) { throw new InvalidTrainerIdException() }
        this.id = id;
    }

    equals(valueObject: TrainerId): boolean {
        return (this.Value === valueObject.Value);
    }

    static create (id:string) {
        return new TrainerId(id);
    }
}