/* eslint-disable prettier/prettier */
import { IApplicationService } from "src/common/Application/application-services/application-service.interface"
import { Result } from "src/common/Domain/result-handler/Result"
import { IUserRepository } from "src/user/domain/repositories/user-repository.interface"
import { User } from "src/user/domain/user"
import { GetUserProfileServiceResponseDto } from "../../dto/responses/get-user-profile-service-response.gto"
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface"
import { GetUserProfileServiceEntryDto } from "../../dto/params/get-user-profile-service-entry.dto"
import { Course } from "src/course/domain/course"
import { ICourseRepository } from "src/course/domain/repositories/course-repository.interface"
import { ProgressCourse } from "src/progress/domain/entities/progress-course"




export class GetUserProfileApplicationService implements IApplicationService<GetUserProfileServiceEntryDto, GetUserProfileServiceResponseDto>{
    
    private readonly userRepository: IUserRepository
    private readonly progressCourseRepository: IProgressCourseRepository
    private readonly courseRespository: ICourseRepository
    constructor ( userRepository: IUserRepository, progressCourseRepository: IProgressCourseRepository, courseRepository: ICourseRepository){
        this.userRepository = userRepository
        this.progressCourseRepository = progressCourseRepository
        this.courseRespository = courseRepository
    }
    
    async execute ( data: GetUserProfileServiceEntryDto ): Promise<Result<GetUserProfileServiceResponseDto>>
    {
        const {perPage = 10, page = 0} = data.pagination
        const resultUser = await this.userRepository.findUserById(data.userId)
        //TODO: Add the search for the user active courses
        if (!resultUser.isSuccess()){
            return Result.fail<GetUserProfileServiceResponseDto>(resultUser.Error, resultUser.StatusCode, resultUser.Message)
        }
        const user = resultUser.Value

        const resultProgressCourses = await this.progressCourseRepository.findAllStartedCourses(user.Id, {perPage, page})
        if (!resultProgressCourses.isSuccess()){
            return Result.fail<GetUserProfileServiceResponseDto>(resultProgressCourses.Error, resultProgressCourses.StatusCode, resultProgressCourses.Message)
        }
        const progressCourses = resultProgressCourses.Value
        const courses: Course[] = []
        const resultProgressCourse: {progress: ProgressCourse, completionPercent: number}[] = []
        for (const progressCourse of progressCourses){
            const resultCourse = await this.courseRespository.findCourseById(progressCourse.CourseId)
            if (!resultCourse.isSuccess()){
                return Result.fail<GetUserProfileServiceResponseDto>(resultCourse.Error, resultCourse.StatusCode, resultCourse.Message)
            }
            resultProgressCourse.push({progress: progressCourse, completionPercent: progressCourse.CompletionPercent})
            courses.push(resultCourse.Value)
        }

        return Result.success<GetUserProfileServiceResponseDto>({user, courses, coursesProgress: resultProgressCourse}, 200)
    }

    get name (): string
    {
        return this.constructor.name
    }

}