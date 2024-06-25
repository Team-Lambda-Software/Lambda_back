import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';



@Schema()
export class OdmCategoryEntity extends Document {
  @Prop({ required: true, unique: true, type: String})
  id: string;

  @Prop({required: true, type: String}) 
  categoryName: string;

  @Prop({required: true, type: String})
  icon: string;

}

export const CategorySchema = SchemaFactory.createForClass(OdmCategoryEntity);