import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidSectionCommentTextException } from '../exceptions/invalid-section-comment-text-exception'


export class SectionCommentText implements IValueObject<SectionCommentText>{
    
    private readonly text: string
    
    get Value(){ return this.text }

    protected constructor ( text: string ){
        if (text.length < 5)
            throw new InvalidSectionCommentTextException()
        this.text = text
    }

    equals ( valueObject: SectionCommentText ): boolean
    {
        return this.text === valueObject.Value
    }

    static create (text: string){
        return new SectionCommentText(text)
    }

}