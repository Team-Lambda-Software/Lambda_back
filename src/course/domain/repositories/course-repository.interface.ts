import { Result } from "src/common/Application/result-handler/Result"
import { Course } from "../course"
import { Section } from "../entities/section"



export interface ICourseRepository {

    findCourseById ( id: string ): Promise<Result<Course>>
    searchCoursesByName ( name: string ): Promise<Result<Course[]>>
    //si hacemos esto por partes tendriamos que buscar las secciones por separado, traer los comentarios de una vez (estilo udemy)
    findCourseSections( id: string ): Promise<Result<Section[]>>
    addCommentToSection( sectionId: string, comment: Comment ): void
    //suponiendo que esto se vaya a hacer por separado de los blogs
    findCoursesByCategory( categoryId: string ): Promise<Result<Course[]>>

}