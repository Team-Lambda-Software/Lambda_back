import { Section } from "src/course/domain/entities/section"
import { SectionComment } from "src/course/domain/entities/section-comment"
import { ProgressVideo } from "src/progress/domain/entities/progress-video"



export interface GetCourseSectionServiceResponseDto {

    section: Section
    comments: SectionComment[]
    videoProgress: ProgressVideo
}