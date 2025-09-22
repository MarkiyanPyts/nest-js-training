import { Injectable } from '@nestjs/common';
import {MessageFormatterService} from "../message-formatter/message-formatter.service";

@Injectable()
export class LoggerService {
    constructor(private readonly messageFormatterService: MessageFormatterService) {}
    
    log(message: string): string {
        console.log(this.messageFormatterService.format(message));
        return this.messageFormatterService.format(message);
    }
}
