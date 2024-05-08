import { Result } from "src/common/Application/result-handler/Result";
import { ProgressSection } from "./progress-section";

export class ProgressCourse
{
    private courseId:string;
    private isCompleted:boolean;
    private sections: Map<string, ProgressSection> = new Map<string, ProgressSection>();

    protected constructor (courseId:string, isCompleted:boolean, sections?:ProgressSection[])
    {
        this.courseId = courseId;
        this.isCompleted = isCompleted;
        if (sections != undefined)
        {
            for (let section of sections)
            {
                this.sections.set(section.SectionId, section);
            }
        }
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
        if (this.sections.size === 0)
        {
            return 0;
        }
        let progressSum = 0;
        for (let sectionTuple of this.sections)
        {
            progressSum += sectionTuple[1].CompletionPercent
        }
        return ( progressSum / this.sections.size );
    }

    get Sections():ProgressSection[]
    {
        let sectionArray:Array<ProgressSection> = new Array<ProgressSection>();
        for (let sectionTuple of this.sections)
        {
            sectionArray.push(sectionTuple[1]);
        }
        return sectionArray;
    }

    static create (courseId:string, isCompleted:boolean, sections?:ProgressSection[])
    {
        return new ProgressCourse(courseId, isCompleted, sections);
    }

    public updateCompletion(isCompleted:boolean)
    {
        this.isCompleted = isCompleted;
    }

    public saveSection(newSection: ProgressSection)
    {
        this.sections.set(newSection.SectionId, newSection);
    }

    public updateSectionCompletionById(sectionId:string, isCompleted:boolean):Result<ProgressSection>
    {
        let target:ProgressSection = this.sections.get(sectionId);
        if (target === undefined) //to-do Use Optional?
        {
            return Result.fail<ProgressSection>(new Error('Section not found in Course'), 404, 'Section not found in Course');
        }
        target.updateCompletion(isCompleted);
        return Result.success<ProgressSection>(target, 200);
    }
}