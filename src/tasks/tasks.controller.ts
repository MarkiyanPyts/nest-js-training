import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import type { ITask } from './tasks.model';
import { CreateTaskDto } from './create.task.dto';
import { FindOneParams } from './find-one.params';
import { UpdateTaskStatusDto } from './update.task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public findAll(): ITask[] {
    return this.tasksService.findAll();
  }

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): ITask | undefined {
    return this.findOneOrFail(params.id);
  }

  @Post()
  public create(@Body() createTaskDto: CreateTaskDto): ITask {
    console.log(createTaskDto);
    return this.tasksService.create(createTaskDto);
  }

  @Patch('/:id/status')
  public updateTaskStatus(
    @Param() params: FindOneParams,
    @Body() createTaskDto: UpdateTaskStatusDto,
  ): ITask {
    const task = this.findOneOrFail(params.id);
    task.status = createTaskDto.status;
    return task;
  }

  private findOneOrFail(id: string): ITask {
    const task = this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }
}
