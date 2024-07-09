import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class OdmNotificationAddressEntity extends Document {
  @Prop({ required: true})
  token: string;

  @Prop({required: true})  
  user_id: string;

}

export const NotificationAddressSchema = SchemaFactory.createForClass(OdmNotificationAddressEntity);
NotificationAddressSchema.index({ token: 1, user_id: 1 }, { unique: true });