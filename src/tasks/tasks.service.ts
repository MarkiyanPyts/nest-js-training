import { Injectable } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { CreateTaskDto } from './create.task.dto';
import { UpdateTaskDto } from './update-task.dto';
import { WrongTaskStatusException } from './exceptions/wrong-task-status.exception';
import { Repository } from 'typeorm';
import { Task } from './task.entiry';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  public async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }

  public async findOne(id: string): Promise<Task | null> {
    console.log(`Looking for task with ${id} in tasks repository`);
    return await this.tasksRepository.findOneBy({ id });
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
    return await this.tasksRepository.save(CreateTaskDto);
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
    Object.assign(task, updateTaskDto);
    return await this.tasksRepository.save(task);
  }

  public async deleteTask(task: Task): Promise<void> {
    await this.tasksRepository.delete(task);
  }
}
