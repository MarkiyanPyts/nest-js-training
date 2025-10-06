import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from './tasks.model';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
