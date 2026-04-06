import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true, versionKey: false })
export class Task {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ default: false })
  completed!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

