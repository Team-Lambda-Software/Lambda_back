import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { Section } from "./entities/section"




export class Course extends Entity<string>
{

    private trainerId: string
    private name: string
    private description: string
    private weeksDuration: number
    private minutesPerSection: number //esto es lo que significa el tiempo que aparece en el figma?
    private level: number
    private sections: Section[]

    protected constructor ( id: string, trainerId: string, name: string, description: string, weeksDuration: number, minutesPerSection: number, level: number, sections: Section[] )
    {
        super( id )
        this.trainerId = trainerId
        this.name = name
        this.description = description
        this.weeksDuration = weeksDuration
        this.minutesPerSection = minutesPerSection
        this.level = level
        this.sections = sections
        this.ensureValidState()
    }

    //las validaciones de aqui que son de los atributos en si van a estar en los value objects en un futuro
    protected ensureValidState (): void
    {
        if ( !this.trainerId )
            throw new Error( "Course must have a trainer" )

        if ( !this.name )
            throw new Error( "Course must have a name" )

        if ( !this.level || this.level < 1 || this.level > 5 )
            throw new Error( "Course must have a valid level" )

        if ( !this.weeksDuration || this.weeksDuration < 1 )
            throw new Error( "Course must have a valid duration" )

        if ( !this.minutesPerSection || this.minutesPerSection < 1 )
            throw new Error( "Course must have a valid duration" )

        if ( !this.sections || this.sections.length < 1 )
            throw new Error( "Course must have at least one section" )

    }

    static create ( id: string, trainerId: string, name: string, description: string, weeksDuration: number, minutesPerSection: number, level: number, sections: Section[] ): Course
    {
        return new Course( id, trainerId, name, description, weeksDuration, minutesPerSection, level, sections )
    }

}