import { Injectable } from '@nestjs/common';
import { DummyService } from './dummy/dummy.service';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class AppService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly dummyService: DummyService
  ) {}

  getHello(): string {
    return `${this.loggerService.log(`Hello World! ${this.dummyService.work()}`)}`;
  }
}
