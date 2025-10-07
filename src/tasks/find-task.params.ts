import { IsEnum, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from './tasks.model';
import { Transform } from 'class-transformer';

export class FindTaskParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @MinLength(3)
  @IsString()
  search?: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }: { value?: string }): string[] | undefined => {
    if (!value) return undefined;
    console.log('Transforming labels:', value);
    return value
      .split(',')
      .map((label: string) => label.trim())
      .filter((label: string) => label.length > 0);
  })
  labels?: string[];

  @IsIn(['createdAt', 'title', 'status'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
