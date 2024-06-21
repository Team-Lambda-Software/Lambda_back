import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OdmCategoryEntity } from 'src/categories/infraesctructure/entities/odm-entities/odm-category.entity'
import { OdmTrainerEntity } from 'src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity'

@Schema()
export class OdmCourseEntity extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({required: true}) 
  name:string;

  @Prop({required: true})  
  description:string;

  @Prop({required: true})  
  level:number;

  @Prop({required: true})  
  weeks_duration:number;

  @Prop({required: true})  
  minutes_per_section:number;

  @Prop({required: true})  
  date: Date;

  @Prop({type: mongoose.Schema.Types.Mixed, required: true})
  category: OdmCategoryEntity;

  @Prop({type: mongoose.Schema.Types.Mixed, required: true})
  trainer: OdmTrainerEntity;

  @Prop({required: true})
  image: string;

  @Prop({required: true})  
  tags:string[];

  @Prop({type: [{id: String, name: String, duration: Number, description: String, video: String}],required: true})
  sections: {id: string, name: string, duration: number, description: string, video: string}[];

}

export const CourseSchema = SchemaFactory.createForClass(OdmCourseEntity);