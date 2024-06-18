import { IValueObject } from 'src/common/Domain/value-object/value-object.interface'
import { InvalidSectionVideoException } from '../exceptions/invalid-section-video-exception'


export class SectionVideo implements IValueObject<SectionVideo>{
    
    private readonly url: string
    
    get Value(){ return this.url }

    protected constructor ( url: string ){
        
        if (url.length < 5)
            throw new InvalidSectionVideoException()
        this.url = url
    }

    equals ( valueObject: SectionVideo ): boolean
    {
        return this.url === valueObject.Value
    }

    static create (url: string){
        return new SectionVideo(url)
    }

}