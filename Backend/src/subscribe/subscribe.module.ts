import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';
import { Subscriber, SubscriberSchema } from './entities/subscriber.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }])],
  controllers: [SubscribeController],
  providers: [SubscribeService],
})
export class SubscribeModule {}

