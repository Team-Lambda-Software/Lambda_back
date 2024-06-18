import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OdmUserEntity } from 'src/user/infraestructure/entities/odm-entities/odm-user.entity'
import { OdmBlogEntity } from './odm-blog.entity'

@Schema()
export class OdmBlogCommentEntity extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({required: true}) 
  text:string;

  @Prop({required: true})  
  date: Date;

  @Prop({type: mongoose.Schema.Types.Mixed, ref: 'Blog', required: true})
  blog: OdmBlogEntity;

  @Prop({type: mongoose.Schema.Types.Mixed, ref: 'User', required: true})
  user: OdmUserEntity;

}

export const BlogCommentSchema = SchemaFactory.createForClass(OdmBlogCommentEntity);