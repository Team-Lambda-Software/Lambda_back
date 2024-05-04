import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { Section } from "./entities/section"
import { Image } from "./entities/compose-fields/image"




export class Course extends Entity<string>
{

    private trainerId: string
    private name: string
    private description: string
    private weeksDuration: number
    private minutesPerSection: number //esto es lo que significa el tiempo que aparece en el figma?
    private level: number
    private categoryId: string
    private sections: Section[]
    private image: Image

    protected constructor ( id: string, trainerId: string, name: string, description: string, weeksDuration: number, minutesPerSection: number, level: number, sections: Section[], categoryId: string, image: Image )
    {
        super( id )
        this.trainerId = trainerId
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

        if ( !this.categoryId )
            throw new Error( "Course must have a category" )

        // si hacemos la imagen opcional o no ya lo veremos
        if ( !this.image )
            throw new Error( "Course must have an image" )

    }

    static create ( id: string, trainerId: string, name: string, description: string, weeksDuration: number, minutesPerSection: number, level: number, sections: Section[], categoryId: string, image: Image ): Course
    {
        return new Course( id, trainerId, name, description, weeksDuration, minutesPerSection, level, sections, categoryId, image )
    }

}