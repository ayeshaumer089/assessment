import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  purpose?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  audience?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  tone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avoid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  success?: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  systemPrompt?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  tools?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(120)
  memory?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(200)
  @IsString({ each: true })
  scenarios?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  manualScenario?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  currentStep?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(4)
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  model?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  desc?: string;
}

