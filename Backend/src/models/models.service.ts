import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

type ModelItem = {
  id: string;
  name: string;
  [key: string]: unknown;
};

@Injectable()
export class ModelsService {
  private readonly modelsPath = join(process.cwd(), 'src', 'models', 'data', 'models.json');
  private readonly models: ModelItem[];

  constructor() {
    const raw = readFileSync(this.modelsPath, 'utf8');
    this.models = JSON.parse(raw) as ModelItem[];
  }

  getAll(): ModelItem[] {
    return this.models;
  }
}
