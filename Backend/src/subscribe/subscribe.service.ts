import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscribeDto } from './dto/subscribe.dto';
import { Subscriber, SubscriberDocument } from './entities/subscriber.schema';

@Injectable()
export class SubscribeService {
  constructor(
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: Model<SubscriberDocument>,
  ) {}

  async subscribe(dto: SubscribeDto) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.subscriberModel.findOne({ email }).lean();
    if (existing) {
      throw new BadRequestException('Email is already subscribed');
    }

    const subscriber = await this.subscriberModel.create({ email });
    return {
      success: true,
      message: 'Subscription saved',
      subscriber: {
        id: String(subscriber._id),
        email: subscriber.email,
      },
    };
  }
}

