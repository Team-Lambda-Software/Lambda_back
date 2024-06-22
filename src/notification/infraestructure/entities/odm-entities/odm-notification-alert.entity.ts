import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class OdmNotificationAlertEntity extends Document {
  
  @Prop({required: true, unique: true})  
  alert_id: string;

  @Prop({required: true})  
  user_id: string;

  @Prop({required: true})  
  title: string;

  @Prop({required: true})  
  body: string;

  @Prop({required: true})  
  date: Date;

  @Prop({required: true})  
  user_readed: boolean;
}

export const NotificationAlertSchema = SchemaFactory.createForClass(OdmNotificationAlertEntity);