import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidSectionCommentIdException } from '../exceptions/invalid-section-comment-id-exception'


export class SectionCommentId implements IValueObject<SectionCommentId>{
    
    private readonly id: string
    
    get Value(){ return this.id }

    protected constructor ( id: string ){
        if (id.length < 5)
            throw new InvalidSectionCommentIdException()
        this.id = id
    }

    equals ( valueObject: SectionCommentId ): boolean
    {
        return this.id === valueObject.Value
    }

    static create (id: string){
        return new SectionCommentId(id)
    }

}