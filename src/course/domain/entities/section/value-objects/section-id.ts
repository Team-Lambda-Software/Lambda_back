import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidSectionIdException } from '../exceptions/invalid-section-id-exception'


export class SectionId implements IValueObject<SectionId>{
    
    private readonly id: string
    
    get Value(){ return this.id }

    protected constructor ( id: string ){
        const regex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
        if (!regex.test(id))
            throw new InvalidSectionIdException()
        this.id = id
    }

    equals ( valueObject: SectionId ): boolean
    {
        return this.id === valueObject.Value
    }

    static create (id: string){
        return new SectionId(id)
    }

}