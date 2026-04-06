import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

