import { Column, Entity, PrimaryColumn } from "typeorm"



@Entity({ name: "auditing" })
export class OrmAuditing
{
    @PrimaryColumn("uuid")
    id: string

    @Column({ type: "varchar", length: 255 })
    userId: string

    @Column({ type: "varchar", length: 255 })
    operation: string

    @Column({ type: "varchar" })
    data: string

    @Column({ type: "timestamp" })
    madeAt: Date

    @Column({ type: "boolean" })
    wasSuccessful: boolean
}