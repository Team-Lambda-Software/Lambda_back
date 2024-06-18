import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OdmCategoryEntity } from 'src/categories/infraesctructure/entities/odm-entities/odm-category.entity'
import { OdmTrainerEntity } from 'src/trainer/infraestructure/entities/odm-entities/odm-trainer.entity'
import { OdmUserEntity } from 'src/user/infraestructure/entities/odm-entities/odm-user.entity'

@Schema()
export class OdmBlogEntity extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({required: true}) 
  title:string;

  @Prop({required: true})  
  body:string;

  @Prop({required: true}) 
  publication_date: Date;

  @Prop({type: mongoose.Schema.Types.Mixed, ref: 'Category', required: true})
  category: OdmCategoryEntity;

  @Prop({ required: false, unique: true })
  phone?: string;

  @Prop({required: false}) 
  latitude:string;

  @Prop({required: false}) 
  longitude:string;

  @Prop({type: [{type: mongoose.Schema.Types.Mixed, ref: 'User'}]})
  followers: OdmUserEntity[]


}

export const BlogSchema = SchemaFactory.createForClass(OdmBlogEntity);