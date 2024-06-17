//unused. Just to prevent dependency problems with other modules

import { Entity, PrimaryColumn } from "typeorm";

@Entity( {name:"progress_video"} )
export class OrmProgressVideo {
    @PrimaryColumn({type:"uuid"})
    public user_id: string;
}