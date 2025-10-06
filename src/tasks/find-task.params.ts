import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from './tasks.model';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @MinLength(3)
  @IsString()
  search?: string;
}
