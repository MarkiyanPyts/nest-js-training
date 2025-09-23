import { Injectable } from '@nestjs/common';
import { ITask } from './tasks.model';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];
}
