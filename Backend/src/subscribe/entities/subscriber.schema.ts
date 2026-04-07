import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubscriberDocument = HydratedDocument<Subscriber>;

@Schema({ timestamps: true, versionKey: false })
export class Subscriber {
  @Prop({ required: true, trim: true, lowercase: true, unique: true, index: true })
  email!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);

