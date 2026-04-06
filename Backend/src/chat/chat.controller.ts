import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

type ChatResponseRequest = {
  key: string;
  payload?: Record<string, unknown>;
};

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('respond')
  respond(@Body() body: ChatResponseRequest) {
    return this.chatService.respond(body.key, body.payload ?? {});
  }
}

