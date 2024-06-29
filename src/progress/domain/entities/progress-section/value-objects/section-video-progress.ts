import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidSectionVideoProgressException } from "../exceptions/invalid-section-video-progress";

export class SectionVideoProgress implements IValueObject<SectionVideoProgress>
{
    private readonly currentTime: number;

    get Value() { return this.currentTime; }

    protected constructor(currentTime:number)
    {
        if (currentTime < 0)
        {
            throw new InvalidSectionVideoProgressException();
        }
        this.currentTime = currentTime;
    }

    equals(valueObject: SectionVideoProgress): boolean {
        return (this.Value === valueObject.Value);
    }

    static create(currentTime:number): SectionVideoProgress
    {
        return new SectionVideoProgress(currentTime);
    }
}