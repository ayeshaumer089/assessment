import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  list(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.tasksService.list(user.id);
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreateTaskDto) {
    const user = req.user as { id: string };
    return this.tasksService.create(user.id, dto);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const user = req.user as { id: string };
    return this.tasksService.update(user.id, id, dto);
  }

  @Post(':id/duplicate')
  duplicate(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { id: string };
    return this.tasksService.duplicate(user.id, id);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { id: string };
    return this.tasksService.remove(user.id, id);
  }
}

