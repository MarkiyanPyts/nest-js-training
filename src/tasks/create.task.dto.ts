import { ITaskStatus } from './tasks.model';

export class CreateTaskDto {
  title: string;
  description: string;
  status: ITaskStatus;
}
