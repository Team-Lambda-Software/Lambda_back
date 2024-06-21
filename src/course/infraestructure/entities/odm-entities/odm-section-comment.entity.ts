import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OdmUserEntity } from 'src/user/infraestructure/entities/odm-entities/odm-user.entity'

@Schema()
export class OdmSectionCommentEntity extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({required: true}) 
  text:string;

  @Prop({required: true})  
  date: Date;

  @Prop({type: {id: String, name: String, duration: Number, description: String, video: String},required: true})
  section: {id: string, name: string, duration: number, description: string, video: string};

  @Prop({type: mongoose.Schema.Types.Mixed, required: true})
  user: OdmUserEntity;

}

export const SectionCommentSchema = SchemaFactory.createForClass(OdmSectionCommentEntity);