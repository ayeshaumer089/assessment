import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AgentDocument = HydratedDocument<Agent>;

@Schema({ timestamps: true, versionKey: false })
export class Agent {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ default: 'Customer Support', trim: true })
  type!: string;

  @Prop({ default: '', trim: true })
  purpose!: string;

  @Prop({ default: 'Customers', trim: true })
  audience!: string;

  @Prop({ default: 'Professional', trim: true })
  tone!: string;

  @Prop({ default: '', trim: true })
  avoid!: string;

  @Prop({ default: '', trim: true })
  success!: string;

  @Prop({ default: '', trim: true })
  systemPrompt!: string;

  @Prop({ type: [String], default: [] })
  tools!: string[];

  @Prop({ default: 'Short-term Only', trim: true })
  memory!: string;

  @Prop({ type: [String], default: [] })
  scenarios!: string[];

  @Prop({ default: '', trim: true })
  manualScenario!: string;

  @Prop({ default: 0 })
  currentStep!: number;

  @Prop({ default: false, index: true })
  completed!: boolean;

  @Prop({ default: '🤖', trim: true })
  icon!: string;

  @Prop({ default: 'GPT-5', trim: true })
  model!: string;

  @Prop({ default: '', trim: true })
  desc!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);

