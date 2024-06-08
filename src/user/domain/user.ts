/* eslint-disable prettier/prettier */
import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { ProgressCourse } from "src/progress/domain/entities/progress-course"
import { ProgressSection } from "src/progress/domain/entities/progress-section"
import { ProgressVideo } from "src/progress/domain/entities/progress-video"
import { Trainer } from "src/trainer/domain/trainer"


export class User extends Entity<string>
{

    private name: string
    private phone: string
    private trainers: Trainer[]
    private progressVideo:ProgressVideo[]
    private progressCourse: ProgressCourse[]
    private progressSection: ProgressSection[]
    private image: string
    //TODO: Add fields for the stadistics, courses made, etc.

    private constructor ( id: string, name: string, phone: string, image?: string, trainers?: Trainer[], progressCourse?: ProgressCourse[], progressSection?: ProgressSection[], progressVideo?: ProgressVideo[])
    {
        super( id )
        this.name = name
        this.phone = phone
        this.trainers = trainers
        this.progressCourse = progressCourse
        this.progressSection = progressSection
        this.progressVideo = progressVideo
        this.image = image
    }

    get Name (): string
    {
        return this.name
    }

    get Image (): string
    {
        return this.image
    }

    get Phone (): string
    {
        return this.phone
    }

    get Trainers (): Trainer[]
    {
        return this.trainers
    }

    get ProgressCourse(): ProgressCourse[]
    {
        return this.progressCourse
    }

    get ProgressSection(): ProgressSection[]
    {
        return this.progressSection
    }

    get ProgressVideo(): ProgressVideo[]
    {
        return this.progressVideo
    }

    static create ( id: string, name: string, phone: string, image?: string): User
    {
        return new User( id, name, phone, image)
    }

    public updateName ( name: string ): void
    {
        this.name = name
    }

    public updateImage ( image: string ): void
    {
        this.image = image
    }

    public updatePhone (phone: string): void
    {
        this.phone = phone
    }


}