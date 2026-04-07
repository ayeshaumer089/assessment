import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentsService } from './agents.service';

@UseGuards(JwtAuthGuard)
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get('templates')
  listTemplates(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.agentsService.listTemplates(user.id);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateAgentDto) {
    const user = req.user as { id: string };
    return this.agentsService.create(user.id, dto);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateAgentDto) {
    const user = req.user as { id: string };
    return this.agentsService.update(user.id, id, dto);
  }
}

