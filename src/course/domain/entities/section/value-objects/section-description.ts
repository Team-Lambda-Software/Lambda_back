import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidSectionDescriptionException } from '../exceptions/invalid-section-description-exception'


export class SectionDescription implements IValueObject<SectionDescription>{
    
    private readonly description: string
    
    get Value(){ return this.description }

    protected constructor ( description: string ){
        if (description.length < 5)
            throw new InvalidSectionDescriptionException()
        this.description = description
    }

    equals ( valueObject: SectionDescription ): boolean
    {
        return this.description === valueObject.Value
    }

    static create (description: string){
        return new SectionDescription(description)
    }

}