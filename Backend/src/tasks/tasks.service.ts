import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>) {}

  async list(userId: string) {
    return this.taskModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean();
  }

  async create(userId: string, dto: CreateTaskDto) {
    const task = await this.taskModel.create({
      userId: new Types.ObjectId(userId),
      name: dto.name.trim(),
      completed: false,
    });
    return task.toObject();
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const updateDoc: Partial<Task> = {};
    if (typeof dto.name === 'string') updateDoc.name = dto.name.trim();
    if (typeof dto.completed === 'boolean') updateDoc.completed = dto.completed;

    const task = await this.taskModel.findOneAndUpdate(
      { _id: new Types.ObjectId(taskId), userId: new Types.ObjectId(userId) },
      { $set: updateDoc },
      { new: true },
    );
    if (!task) throw new NotFoundException('Task not found');
    return task.toObject();
  }

  async duplicate(userId: string, taskId: string) {
    const source = await this.taskModel.findOne({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });
    if (!source) throw new NotFoundException('Task not found');

    const copy = await this.taskModel.create({
      userId: new Types.ObjectId(userId),
      name: `${source.name} (copy)`,
      completed: false,
    });
    return copy.toObject();
  }

  async remove(userId: string, taskId: string) {
    const deleted = await this.taskModel.findOneAndDelete({
      _id: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });
    if (!deleted) throw new NotFoundException('Task not found');
    return { success: true };
  }
}

