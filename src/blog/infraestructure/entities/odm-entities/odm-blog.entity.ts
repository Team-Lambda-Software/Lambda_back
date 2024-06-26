import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OdmCategoryEntity } from 'src/categories/infraesctructure/entities/odm-entities/odm-category.entity'
import { OdmTrainerEntity } from 'src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity'

@Schema()
export class OdmBlogEntity extends Document {
  @Prop({ required: true, unique: true, type: String})
  id: string;

  @Prop({required: true, type: String}) 
  title:string;

  @Prop({required: true, type: String})  
  body:string;

  @Prop({required: true, type: Date})  
  publication_date: Date;

  @Prop({type: mongoose.Schema.Types.Mixed, required: true})
  category: OdmCategoryEntity;

  @Prop({type: mongoose.Schema.Types.Mixed, required: true})
  trainer: OdmTrainerEntity;

  @Prop({type: [{id: String, url: String}],required: true})
  images: {id: string, url: string}[];

  @Prop({required: true, type: [String]})  
  tags:string[];

}

export const BlogSchema = SchemaFactory.createForClass(OdmBlogEntity);