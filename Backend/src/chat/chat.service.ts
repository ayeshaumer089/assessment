import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

type ChatTemplates = Record<string, unknown>;

@Injectable()
export class ChatService {
  private readonly responsesPath = join(process.cwd(), 'src', 'chat', 'data', 'chat-responses.json');
  private cache: ChatTemplates | null = null;

  private getTemplates(): ChatTemplates {
    if (this.cache) return this.cache;
    const raw = readFileSync(this.responsesPath, 'utf8');
    this.cache = JSON.parse(raw) as ChatTemplates;
    return this.cache;
  }

  private renderTemplate(template: string, payload: Record<string, unknown>): string {
    return template.replace(/\{\{(.*?)\}\}/g, (_, key: string) => {
      const val = payload[key.trim()];
      return val === undefined || val === null ? '' : String(val);
    });
  }

  private buildAutoPrompt(payload: Record<string, unknown>): string {
    const goal = String(payload.goal ?? 'my AI goals');
    const audience = String(payload.audience ?? 'my use case');
    const level = String(payload.level ?? '');
    const budget = String(payload.budget ?? '');

    let levelNote = '';
    const l = level.toLowerCase();
    if (l.includes('beginner')) levelNote = 'Please explain things clearly with no assumed technical knowledge.';
    else if (l.includes('developer')) levelNote = 'I am a developer - feel free to use technical terms and code snippets.';

    const budgetNote = String(budget).toLowerCase().includes('free')
      ? 'Prioritise free or open-source solutions where possible.'
      : 'Focus on the best solution and note major cost trade-offs.';

    return `You are a helpful AI assistant. Help me with: ${goal}.\n\nThis is for ${audience}. ${levelNote}\n\nPlease give a clear, structured response with practical steps I can act on immediately. ${budgetNote}\n\nStart with a concise overview, then walk me through the most effective approach step by step.`;
  }

  respond(key: string, payload: Record<string, unknown>) {
    if (key === 'auto_prompt') {
      return { text: this.buildAutoPrompt(payload) };
    }

    const templates = this.getTemplates();
    const value = templates[key];
    if (!value) return { text: '' };

    if (typeof value === 'string') {
      return { text: this.renderTemplate(value, payload) };
    }

    if (typeof value === 'object') {
      const out: Record<string, unknown> = {};
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
        out[k] = typeof v === 'string' ? this.renderTemplate(v, payload) : v;
      });
      return out;
    }

    return { text: '' };
  }
}

