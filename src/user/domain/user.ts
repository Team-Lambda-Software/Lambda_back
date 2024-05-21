/* eslint-disable prettier/prettier */
import { Entity } from "src/common/Domain/domain-object/entity.interface"
import { ProgressCourse } from "src/progress/domain/entities/progress-course"
import { ProgressSection } from "src/progress/domain/entities/progress-section"
import { ProgressVideo } from "src/progress/domain/entities/progress-video"
import { Trainer } from "src/trainer/domain/trainer"


export class User extends Entity<string>
{

    private name: string
    private email: string
    private password: string
    private phone: string
    private trainers: Trainer[]
    private progressVideo:ProgressVideo[]
    private progressCourse: ProgressCourse[]
    private progressSection: ProgressSection[]
    private image: string
    private type: string
    //TODO: Add fields for the stadistics, courses made, etc.

    private constructor ( id: string, name: string, email: string, password: string, phone: string, type: string, trainers?: Trainer[], progressCourse?: ProgressCourse[], progressSection?: ProgressSection[], progressVideo?: ProgressVideo[], image?: string)
    {
        super( id )
        this.name = name
        this.email = email
        this.password = password
        this.phone = phone
        this.trainers = trainers
        this.progressCourse = progressCourse
        this.progressSection = progressSection
        this.progressVideo = progressVideo
        this.image = image
        this.type = type
    }

    get Name (): string
    {
        return this.name
    }

    get Image (): string
    {
        return this.image
    }

    get Email (): string
    {
        return this.email
    }

    get Type (): string
    {
        return this.type
    }

    get Password (): string
    {
        return this.password
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

    static create ( id: string, name: string, email: string, password: string, phone: string, type: string ): User
    {
        return new User( id, name, email, password, phone, type )
    }

    public updateName ( name: string ): void
    {
        this.name = name
    }

    public updateImage ( image: string ): void
    {
        this.image = image
    }

    public updateEmail ( email: string ): void
    {
        this.email = email
    }

    public updateType ( type: string ): void
    {
        this.type = type
    }

    public updatePassword ( password: string ): void
    {
        this.password = password
    }

    public updatePhone (phone: string): void
    {
        this.phone = phone
    }


}