import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidSectionNameException } from '../exceptions/invalid-section-name-exception'


export class SectionName implements IValueObject<SectionName>{
    
    private readonly name: string
    
    get Value(){ return this.name }

    protected constructor ( name: string ){
        if (name.length < 5 || name.length > 120)
            throw new InvalidSectionNameException()
        this.name = name
    }

    equals ( valueObject: SectionName ): boolean
    {
        return this.name === valueObject.Value
    }

    static create (name: string){
        return new SectionName(name)
    }

}