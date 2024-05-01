import { Section } from "src/course/domain/entities/section"
import { SectionComment } from "src/course/domain/entities/section-comment"



export interface GetCourseSectionServiceResponseDto {

    section: Section
    comments: SectionComment[]

}