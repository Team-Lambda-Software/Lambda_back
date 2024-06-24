import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidTrainerLocationException } from "../exceptions/invalid-trainer-location";

export class TrainerLocation implements IValueObject<TrainerLocation> {
    private readonly latitude: number;
    private readonly longitude: number;

    get Latitude(): number
    {
        return this.latitude;
    }

    get Longitude(): number
    {
        return this.longitude;
    }

    protected constructor (latitude: number, longitude:number) {
        if (Math.abs(latitude) > 90) { throw new InvalidTrainerLocationException(); }
        if (Math.abs(longitude) > 180) { throw new InvalidTrainerLocationException(); }
        this.latitude = latitude;
        this.longitude = longitude;
    }

    equals(valueObject: TrainerLocation): boolean {
        const epsilon = 0.00001 //this precision lets unambiguous identification of individual houses or trees (1m radius at equator), thus, is sufficient for this particular application
        if (Math.abs(this.Latitude - valueObject.Latitude) > epsilon) { return false; }
        if (Math.abs(this.Longitude - valueObject.Longitude) > epsilon) { return false; }
        return true;
    }

    static create (latitude:number, longitude:number) {
        return new TrainerLocation(latitude, longitude);
    }
}