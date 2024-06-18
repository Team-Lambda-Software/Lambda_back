import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidSectionCommentDateException } from '../exceptions/invalid-section-comment-date-exception'


export class SectionCommentDate implements IValueObject<SectionCommentDate>{
    
    private readonly date: Date
    
    get Value(){ return this.date }

    protected constructor ( date: Date ){
        if (date > new Date())
            throw new InvalidSectionCommentDateException()
        this.date = date
    }

    equals ( valueObject: SectionCommentDate ): boolean
    {
        return this.date === valueObject.Value
    }

    static create (date: Date){
        return new SectionCommentDate(date)
    }

}