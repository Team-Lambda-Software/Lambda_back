import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { OdmCourseEntity } from "src/course/infraestructure/entities/odm-entities/odm-course.entity";

@Schema()
export class OdmProgressEntity extends Document {
    @Prop({ required:true, unique:true, type:String })
    progress_id:string;

    @Prop({ required:true, type:String })
    course_id:string;

    @Prop({ type: mongoose.Schema.Types.Mixed, required:true })
    course:OdmCourseEntity;

    @Prop({required:true, type:String})
    user_id:string;

    @Prop({required:true, type:Boolean})
    completed:boolean;

    @Prop({required:true, type:Number})
    completion_percent:number;

    @Prop({required:true, type:Date})
    last_seen_date:Date;

    @Prop({type: [{progress_id:String, section_id:String, completed:Boolean, completion_percent:Number, video_second:Number}], required:true })
    section_progress: {progress_id:string, section_id:string, completed:boolean, completion_percent:number, video_second:number}[];
}

export const ProgressSchema = SchemaFactory.createForClass(OdmProgressEntity);