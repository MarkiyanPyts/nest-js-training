import { Injectable } from '@nestjs/common';
import { ITask, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './create.task.dto';
import { randomUUID } from 'node:crypto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  public findAll(): ITask[] {
    return this.tasks;
  }

  public findOne(id: string): ITask | undefined {
    console.log(`Looking for task with ${id} in ${JSON.stringify(this.tasks)}`);
    return this.tasks.find((task) => task.id === id);
  }

  public create(CreateTaskDto: CreateTaskDto): ITask {
    const task: ITask = {
      id: randomUUID(),
      ...CreateTaskDto,
    };
    this.tasks.push(task);
    return task;
  }

  private isValidStatusTransition(
    currentStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(currentStatus) <= statusOrder.indexOf(newStatus);
  }

  update(task: ITask, updateTaskDto: UpdateTaskDto): ITask {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }
    Object.assign(task, updateTaskDto);
    return task;
  }

  public delete(task: ITask): void {
    this.tasks = this.tasks.filter(
      (filteredTask) => filteredTask.id !== task.id,
    );
  }
}
