import { Module } from '@nestjs/common';
import { SmsService } from './services/sms.service';
import { SmsController } from './services/sms.controller.v1';
import { LoggerService } from 'src/common/logger/logger.service';
import { ErrorHandlerService } from 'src/common/exception/handler/error-handler.service';

@Module({
    imports: [],
    controllers: [SmsController],
    providers: [SmsService, LoggerService, ErrorHandlerService],
})
export class SmsModule {}
