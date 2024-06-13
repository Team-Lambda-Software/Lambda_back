import { IApplicationService } from "src/common/Application/application-services/application-service.interface";
import { Result } from "src/common/Application/result-handler/Result";
import { IProgressCourseRepository } from "src/progress/domain/repositories/progress-course-repository.interface";
import { ProgressCourse } from "src/progress/domain/entities/progress-course";
import { SaveCourseProgressServiceEntryDto } from "../../dto/parameters/save-progress-course-entry.dto";
import { ProgressSection } from "src/progress/domain/entities/progress-section";
import { SaveSectionProgressServiceEntryDto } from "../../dto/parameters/save-progress-section-entry.dto";
import { SaveSectionProgressApplicationService } from "./save-progress-section.application.service";
import { SaveSectionProgressEntryDto } from "src/progress/infraestructure/dto/entry/save-section-progress-entry.dto";
import { stringify } from "querystring";
//to-do //! Should this be refactored or destroyed altogether?
//unused Seems like this service won't be needed in the new version of the API
// export class SaveCourseProgressApplicationService implements IApplicationService<SaveCourseProgressServiceEntryDto, ProgressCourse>
// {
//     private readonly progressRepository: IProgressCourseRepository;
//     private readonly saveSectionService: SaveSectionProgressApplicationService; //! Should *not* couple this service to another one. How to decouple?

//     constructor ( progressRepository:IProgressCourseRepository, saveSectionService: SaveSectionProgressApplicationService )
//     {
//         this.progressRepository = progressRepository;
//         this.saveSectionService = saveSectionService;
//     }

//     async execute(data: SaveCourseProgressServiceEntryDto): Promise<Result<ProgressCourse>>
//     {
//         const progressResult = await this.progressRepository.getCourseProgressById(data.userId, data.courseId);
//         if (!progressResult.isSuccess())
//         {
//             return Result.fail<ProgressCourse>(progressResult.Error, progressResult.StatusCode, progressResult.Message);
//         }
//         const progressUpdate:ProgressCourse = progressResult.Value;

//         if (data.isCompleted != undefined) progressUpdate.updateCompletion(data.isCompleted);
//         if ( data.sections instanceof Map ) //! Use instanceOf to force typescript to cast JS object recieved on API body
//         {
//             for (let sectionTuple of data.sections)
//             {
//                 const sectionAttributes = sectionTuple[1];
//                 let videoMap:Map<string, {userId:string, videoId:string, playbackMilisec:number, isCompleted:boolean}> = new Map<string, {userId:string, videoId:string, playbackMilisec:number, isCompleted:boolean}>();
//                 let videoArray:ProgressVideo[] = [];
                
//                 if ( sectionAttributes.videos ) 
//                 {
//                     let videosObject = <Object>(sectionAttributes.videos);
//                     for (let key in videosObject)
//                     {
//                         const videoAttributes = videosObject[key]; //Extract content of raw Map recieved from request body
//                         let video:ProgressVideo = ProgressVideo.create(videoAttributes.userId, videoAttributes.videoId, videoAttributes.playbackMilisec, videoAttributes.isCompleted);
//                         videoArray.push(video);
//                         videoMap.set(video.VideoId, {userId:video.UserId, videoId:video.VideoId, playbackMilisec:video.PlaybackMilisec, isCompleted:video.IsCompleted});
//                     }
//                 }
//                 const section:ProgressSection = ProgressSection.create(sectionAttributes.userId, sectionAttributes.sectionId, sectionAttributes.isCompleted, videoArray);
                
//                 let sectionSaveDto:SaveSectionProgressServiceEntryDto = {userId: data.userId, sectionId:section.SectionId, isCompleted: section.IsCompleted, videos: videoMap};
                
//                 progressUpdate.saveSection(section);

//                 let sectionResult:Result<ProgressSection> = await this.saveSectionService.execute(sectionSaveDto); //When saving a course, cascade-save all progress of sections within
//                 if (!sectionResult.isSuccess()) //If section could not be saved, abort course saving
//                 {
//                     return Result.fail<ProgressCourse>(sectionResult.Error, sectionResult.StatusCode, sectionResult.Message);
//                 }
//             }
//         }

//         const updateResult = await this.progressRepository.saveCourseProgress(progressUpdate);
//         if (!updateResult.isSuccess())
//         {
//             return Result.fail<ProgressCourse>(updateResult.Error, updateResult.StatusCode, updateResult.Message);
//         }
//         return updateResult;
//     }

//     get name():string
//     {
//         return this.constructor.name;
//     }
// }