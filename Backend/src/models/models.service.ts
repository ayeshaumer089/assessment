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
  private modelsCache: ModelItem[] | null = null;

  getAll(): ModelItem[] {
    if (this.modelsCache) {
      return this.modelsCache;
    }

    const raw = readFileSync(this.modelsPath, 'utf8');
    this.modelsCache = JSON.parse(raw) as ModelItem[];
    return this.modelsCache;
  }
}
