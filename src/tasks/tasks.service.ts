import { Injectable } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { CreateTaskDto } from './create.task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { Task } from './task.entiry';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLabel } from './task-label.entity';
import { CreateTaskLabelDto } from './create-task-label.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,

    @InjectRepository(TaskLabel)
    private readonly taskLabelsRepository: Repository<TaskLabel>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  public async findOne(id: string): Promise<Task | null> {
    console.log(`Looking for task with ${id} in tasks repository`);
    return await this.tasksRepository.findOne({
      where: { id },
      relations: ['labels'], // also load all related labels
    });
  }

  public async createTask(CreateTaskDto: CreateTaskDto): Promise<Task> {
    // const task: CreateTaskDto = {
    //   title: 'Learn NestJS',
    //   description: 'Complete NestJS project',
    //   status: TaskStatus.OPEN,
    //   userId: 'bfa4cdb7-77b8-4913-8bd7-0a52b1d7fd42',
    //   labels: [{ name: 'backend' }, { name: 'nestjs' }],
    // };
    // this.tasksRepository.create(task);
    if (CreateTaskDto.labels) {
      CreateTaskDto.labels = this.getUniqueLabels(CreateTaskDto.labels);
    }
    return await this.tasksRepository.save(CreateTaskDto);
  }

  public async addLabels(
    task: Task,
    labelsDtos: CreateTaskLabelDto[],
  ): Promise<Task> {
    const existingNames = new Set(task.labels.map((label) => label.name));

    const labels = this.getUniqueLabels(labelsDtos)
      .filter((dto) => {
        return !existingNames.has(dto.name);
      })
      .map((label) => {
        return this.taskLabelsRepository.create(label); //just creating not saving yet
      });

    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.tasksRepository.save(task); //saving task will also save labels because of cascade option
    } else {
      return task;
    }
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

  public async updateTask(
    task: Task,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    if (
      updateTaskDto.status &&
      !this.isValidStatusTransition(task.status, updateTaskDto.status)
    ) {
      throw new WrongTaskStatusException();
    }

    if (updateTaskDto.labels) {
      updateTaskDto.labels = this.getUniqueLabels(updateTaskDto.labels);
    }

    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  public async removeLabels(
    task: Task,
    labelsToRemove: string[],
  ): Promise<Task> {
    task.labels = task.labels.filter(
      (label) => !labelsToRemove.includes(label.name),
    );
    return await this.tasksRepository.save(task);
  }

  public async deleteTask(task: Task): Promise<void> {
    // await this.tasksRepository.delete(task); // type orm does not support cascade delete for delete method
    // await this.tasksRepository.delete(task.id); // passing id to delete method also works fine
    await this.tasksRepository.remove(task); // remove also removes related labels because of cascade option. It Creates a transaction behind the scenes
  }

  private getUniqueLabels(
    labelsDtos: CreateTaskLabelDto[],
  ): CreateTaskLabelDto[] {
    const uniqueNames = [...new Set(labelsDtos.map((label) => label.name))];

    return uniqueNames.map((name) => ({ name }));
  }
}
