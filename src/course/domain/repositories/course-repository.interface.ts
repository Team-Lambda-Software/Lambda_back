import { Result } from "src/common/Application/result-handler/Result"
import { Course } from "../course"
import { Section } from "../entities/section"
import { SectionComment } from "../entities/section-comment"



export interface ICourseRepository {

    findCourseById ( id: string ): Promise<Result<Course>>
    findCoursesByName ( name: string ): Promise<Result<Course[]>>
    findCourseSections( id: string ): Promise<Result<Section[]>>
    addCommentToSection( comment: SectionComment ): Promise<Result<SectionComment>>
    //suponiendo que esto se vaya a hacer por separado de los blogs
    findCoursesByCategory( categoryId: string ): Promise<Result<Course[]>>
    findSectionById (sectionId: string): Promise<Result<Section>>
    findSectionComments (sectionId: string): Promise<Result<SectionComment[]>>
    findAllTrainerCourses (trainerId: string): Promise<Result<Course[]>>

}