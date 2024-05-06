import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { Section } from "./entities/section"
import { SectionImage } from "./entities/compose-fields/section-image"
import { Trainer } from "src/trainer/domain/trainer"




export class Course extends Entity<string>
{

    private trainer: Trainer
    private name: string
    private description: string
    private weeksDuration: number
    private minutesPerSection: number //esto es lo que significa el tiempo que aparece en el figma?
    private level: number
    private categoryId: string
    private sections: Section[]
    private image: SectionImage

    get Trainer (): Trainer
    {
        return this.trainer
    }

    get Name (): string
    {
        return this.name
    }

    get Description (): string
    {
        return this.description
    }

    get WeeksDuration (): number
    {
        return this.weeksDuration
    }

    get MinutesPerSection (): number
    {
        return this.minutesPerSection
    }

    get Level (): number
    {
        return this.level
    }

    get CategoryId (): string
    {
        return this.categoryId
    }

    get Sections (): Section[]
    {
        return this.sections
    }

    get Image (): SectionImage
    {
        return this.image
    }
    protected constructor ( id: string, trainer: Trainer, name: string, description: string, weeksDuration: number, minutesPerSection: number, level: number, sections: Section[], categoryId: string, image: SectionImage )
    {
        super( id )
        this.trainer = trainer
        this.name = name
        this.description = description
        this.weeksDuration = weeksDuration
        this.minutesPerSection = minutesPerSection
        this.level = level
        this.sections = sections
        this.categoryId = categoryId
        this.image = image
        this.ensureValidState()
    }

    //las validaciones de aqui que son de los atributos en si van a estar en los value objects en un futuro
    protected ensureValidState (): void
    {
        if ( !this.trainer )
            throw new Error( "Course must have a trainer" )

        if ( !this.name )
            throw new Error( "Course must have a name" )

        if ( !this.level || this.level < 1 || this.level > 5 )
            throw new Error( "Course must have a valid level" )

        if ( !this.weeksDuration || this.weeksDuration < 1 )
            throw new Error( "Course must have a valid duration" )

        if ( !this.minutesPerSection || this.minutesPerSection < 1 )
            throw new Error( "Course must have a valid duration" )

        if ( !this.categoryId )
            throw new Error( "Course must have a category" )

        // si hacemos la imagen opcional o no ya lo veremos
        if ( !this.image )
            throw new Error( "Course must have an image" )

    }

    changeSections ( sections: Section[] ): void
    {
        this.sections = sections
    }

    static create ( id: string, trainer: Trainer, name: string, description: string, weeksDuration: number, minutesPerSection: number, level: number, sections: Section[], categoryId: string, image: SectionImage ): Course
    {
        return new Course( id, trainer, name, description, weeksDuration, minutesPerSection, level, sections, categoryId, image )
    }

}