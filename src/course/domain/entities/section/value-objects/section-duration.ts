import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidSectionDurationException } from '../exceptions/invalid-section-duration-exception'


export class SectionDuration implements IValueObject<SectionDuration>{
    
    private readonly duration: number
    
    get Value(){ return this.duration }

    protected constructor ( duration: number ){
        if (duration <= 0 )
            throw new InvalidSectionDurationException()
        this.duration = duration
    }

    equals ( valueObject: SectionDuration ): boolean
    {
        return this.duration === valueObject.Value
    }

    static create (duration: number){
        return new SectionDuration(duration)
    }

}