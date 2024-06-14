//unused. Just to prevent dependency problems with other modules

import { Entity } from "typeorm";

@Entity( {name:"progress_video"} )
export class OrmProgressVideo {
    public user_id: string;
}