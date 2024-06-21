import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';



@Schema()
export class OdmCategoryEntity extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({required: true}) 
  categoryName: string;

  @Prop({required: true})
  icon: string;

}

export const CategorySchema = SchemaFactory.createForClass(OdmCategoryEntity);