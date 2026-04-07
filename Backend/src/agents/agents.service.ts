import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Agent, AgentDocument } from './entities/agent.schema';

@Injectable()
export class AgentsService {
  constructor(@InjectModel(Agent.name) private readonly agentModel: Model<AgentDocument>) {}

  async create(userId: string, dto: CreateAgentDto) {
    const created = await this.agentModel.create({
      userId: new Types.ObjectId(userId),
      ...this.sanitizePayload(dto),
    });
    return created.toObject();
  }

  async update(userId: string, agentId: string, dto: UpdateAgentDto) {
    const updated = await this.agentModel.findOneAndUpdate(
      { _id: new Types.ObjectId(agentId), userId: new Types.ObjectId(userId) },
      { $set: this.sanitizePayload(dto) },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Agent not found');
    return updated.toObject();
  }

  async listTemplates(userId: string) {
    return this.agentModel
      .find({ userId: new Types.ObjectId(userId), completed: true })
      .sort({ updatedAt: -1 })
      .lean();
  }

  private sanitizePayload(dto: Partial<CreateAgentDto>) {
    const payload: Record<string, unknown> = {};

    if (typeof dto.name === 'string') payload.name = dto.name.trim();
    if (typeof dto.type === 'string') payload.type = dto.type.trim();
    if (typeof dto.purpose === 'string') payload.purpose = dto.purpose.trim();
    if (typeof dto.audience === 'string') payload.audience = dto.audience.trim();
    if (typeof dto.tone === 'string') payload.tone = dto.tone.trim();
    if (typeof dto.avoid === 'string') payload.avoid = dto.avoid.trim();
    if (typeof dto.success === 'string') payload.success = dto.success.trim();
    if (typeof dto.systemPrompt === 'string') payload.systemPrompt = dto.systemPrompt.trim();
    if (Array.isArray(dto.tools)) payload.tools = dto.tools.map((item) => String(item).trim()).filter(Boolean);
    if (typeof dto.memory === 'string') payload.memory = dto.memory.trim();
    if (Array.isArray(dto.scenarios)) {
      payload.scenarios = dto.scenarios.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof dto.manualScenario === 'string') payload.manualScenario = dto.manualScenario.trim();
    if (typeof dto.currentStep === 'number') payload.currentStep = dto.currentStep;
    if (typeof dto.completed === 'boolean') payload.completed = dto.completed;
    if (typeof dto.icon === 'string') payload.icon = dto.icon.trim();
    if (typeof dto.model === 'string') payload.model = dto.model.trim();
    if (typeof dto.desc === 'string') payload.desc = dto.desc.trim();

    return payload;
  }
}

