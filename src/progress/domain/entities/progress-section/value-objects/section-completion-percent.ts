import { IValueObject } from "src/common/Domain/value-object/value-object.interface";
import { InvalidSectionCompletionPercentException } from "../exceptions/invalid-section-completion-percent-exception";

export class SectionCompletionPercent implements IValueObject<SectionCompletionPercent>
{
    private readonly completion:number;

    get Value() { return this.completion; }

    protected constructor (completion: number)
    {
        if ((completion < 0) || (completion > 100))
        {
            throw new InvalidSectionCompletionPercentException();
        }
        this.completion = completion;
    }

    static create (completion:number):SectionCompletionPercent
    {
        return new SectionCompletionPercent(completion);
    }

    equals(valueObject: SectionCompletionPercent): boolean {
        return (this.Value === valueObject.Value);
    }
}