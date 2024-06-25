import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { OdmUserEntity } from 'src/user/infraestructure/entities/odm-entities/odm-user.entity'

@Schema()
export class OdmTrainerEntity extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({required: true}) 
  first_name:string;

  @Prop({required: true})  
  first_last_name:string;

  @Prop({required: true}) 
  second_last_name:string;

  @Prop({required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({required: false}) 
  latitude:string;

  @Prop({required: false}) 
  longitude:string;

  @Prop({type: [{type: mongoose.Schema.Types.Mixed, ref: 'User'}]})
  followers: OdmUserEntity[]


}

export const TrainerSchema = SchemaFactory.createForClass(OdmTrainerEntity);