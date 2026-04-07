import { Body, Controller, Post } from '@nestjs/common';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscribeService } from './subscribe.service';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  create(@Body() dto: SubscribeDto) {
    return this.subscribeService.subscribe(dto);
  }
}

