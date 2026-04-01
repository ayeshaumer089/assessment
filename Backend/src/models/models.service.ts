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

  getAll(): ModelItem[] {
    const raw = readFileSync(this.modelsPath, 'utf8');
    return JSON.parse(raw) as ModelItem[];
  }
}
