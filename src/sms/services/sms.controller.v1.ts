import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendLmsDto, SendSmsDto } from '../dtos/request.dto';
import { SendMsgResDto } from '../dtos/response.dto';
import { ControllerResponse } from 'src/common/response/dto/controller-response.dto';
import { SEND_REQ_COMPLETED } from '../types';
import { LoggerService } from 'src/common/logger/services/logger.service';
import { CustomSwaggerDecorator } from 'src/common/decorator/swagger.decorator';
import { sendLmsOpts, sendSmsOpts } from '../swagger/swagger.metadata';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('v1')
@UsePipes(new ValidationPipe({ transform: true }))
export class SmsController {
    constructor(
        private readonly smsService: SmsService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext(SmsController.name);
    }

    // Send SMS API
    @Post('sms')
    @CustomSwaggerDecorator(sendSmsOpts)
    async sendSms(@Body() sendSmsDto: SendSmsDto): Promise<ControllerResponse<SendMsgResDto>> {
        const sendSmsResDto = await this.smsService.sendSMS(sendSmsDto);
        const response = ControllerResponse.create<SendMsgResDto>(SEND_REQ_COMPLETED, sendSmsResDto);

        return response;
    }

    // Send LMS API
    @Post('lms')
    @CustomSwaggerDecorator(sendLmsOpts)
    async sendLms(@Body() sendLmsDto: SendLmsDto): Promise<ControllerResponse<SendMsgResDto>> {
        const sendLmsResDto = await this.smsService.sendLMS(sendLmsDto);
        const response = ControllerResponse.create<SendMsgResDto>(SEND_REQ_COMPLETED, sendLmsResDto);

        return response;
    }
}
