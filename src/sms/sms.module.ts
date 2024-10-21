import { Module } from '@nestjs/common';
import { SmsService } from './services/sms.service';
import { SmsController } from './services/sms.controller.v1';

@Module({
    imports: [],
    controllers: [SmsController],
    providers: [SmsService],
})
export class SmsModule {}
