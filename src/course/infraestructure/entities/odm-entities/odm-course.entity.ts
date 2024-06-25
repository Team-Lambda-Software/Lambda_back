import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OdmCategoryEntity } from 'src/categories/infraesctructure/entities/odm-entities/odm-category.entity'
import { OdmTrainerEntity } from 'src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity'

@Schema()
export class OdmCourseEntity extends Document {
  @Prop({ required: true, unique: true, type: String})
  id: string;

  @Prop({required: true, type: String}) 
  name:string;

  @Prop({required: true, type: String})  
  description:string;

  @Prop({required: true, type: Number})  
  level:number;

  @Prop({required: true, type: Number})  
  weeks_duration:number;

  @Prop({required: true, type: Number})  
  minutes_per_section:number;

  @Prop({required: true, type: Date})  
  date: Date;

  @Prop({type: mongoose.Schema.Types.Mixed, required: true})
  category: OdmCategoryEntity;

  @Prop({type: mongoose.Schema.Types.Mixed, required: true})
  trainer: OdmTrainerEntity;

  @Prop({required: true, type: String})
  image: string;

  @Prop({required: true, type: [String]})  
  tags:string[];

  @Prop({type: [{id: String, name: String, duration: Number, description: String, video: String}],required: true})
  sections: {id: string, name: string, duration: number, description: string, video: string}[];

}

export const CourseSchema = SchemaFactory.createForClass(OdmCourseEntity);