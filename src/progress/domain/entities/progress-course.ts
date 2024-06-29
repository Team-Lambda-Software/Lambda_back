import { Result } from "src/common/Domain/result-handler/Result";
import { ProgressSection } from "./progress-section/section-progress";
import { Entity } from "src/common/Domain/domain-object/entity.interface";

export class ProgressCourse extends Entity<string>
{
    private userId:string;
    private courseId:string;
    private isCompleted:boolean;
    private sectionProgress: Map<string, ProgressSection> = new Map<string, ProgressSection>();

    protected constructor (progressId:string, userId:string, courseId:string, isCompleted:boolean, sections?:ProgressSection[])
    {
        super(progressId)
        this.userId = userId;
        this.courseId = courseId;
        this.isCompleted = isCompleted;
        if (sections != undefined)
        {
            for (let section of sections)
            {
                this.sectionProgress.set(section.SectionId, section);
            }
        }
    }

    get UserId():string
    {
        return this.userId;
    }

    get CourseId():string
    {
        return this.courseId;
    }

    get IsCompleted():boolean
    {
        return this.isCompleted;
    }

    //Course progress equals to mean of section progress of all its sections
    get CompletionPercent():number
    {
        if (this.IsCompleted)
        {
            return 100;
        }
        if (this.sectionProgress.size === 0)
        {
            return 0;
        }
        let progressSum = 0;
        for (let sectionTuple of this.sectionProgress)
        {
            progressSum += sectionTuple[1].CompletionPercent
        }
        return ( progressSum / this.sectionProgress.size );
    }

    get Sections():ProgressSection[]
    {
        let sectionArray:Array<ProgressSection> = new Array<ProgressSection>();
        for (let sectionTuple of this.sectionProgress)
        {
            sectionArray.push(sectionTuple[1]);
        }
        return sectionArray;
    }

    public getSectionById(sectionId:string):Result<ProgressSection>
    {
        const sectionSearch = this.sectionProgress.get(sectionId);
        if (sectionSearch === undefined) //to-do use optional?
        {
            return Result.fail<ProgressSection>(new Error("Section not found on course"), 404, "Section not found on course");
        }
        return Result.success<ProgressSection>(<ProgressSection>sectionSearch, 200);
    }

    static create (progressId:string, userId:string, courseId:string, isCompleted:boolean, sections?:ProgressSection[])
    {
        return new ProgressCourse(progressId, userId, courseId, isCompleted, sections);
    }

    public updateCompletion(isCompleted:boolean)
    {
        this.isCompleted = isCompleted;
    }

    public saveSection(newSection: ProgressSection)
    {
        this.sectionProgress.set(newSection.SectionId, newSection);
    }

    public updateSectionCompletionById(sectionId:string, isCompleted:boolean):Result<ProgressSection>
    {
        let target:ProgressSection = this.sectionProgress.get(sectionId);
        if (target === undefined) //to-do Use Optional?
        {
            return Result.fail<ProgressSection>(new Error('Section not found in Course'), 404, 'Section not found in Course');
        }
        target.updateCompletion(isCompleted);
        return Result.success<ProgressSection>(target, 200);
    }
}