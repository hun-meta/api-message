import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendLmsDto, SendSmsDto } from '../dtos/request.dto';
import { SendMsgResDto } from '../dtos/response.dto';
import { ControllerResponse } from 'src/common/response/dto/controller-response.dto';
import { SEND_REQ_COMPLETED } from '../types';
import { LoggerService } from 'src/common/logger/logger.service';
import { CustomSwaggerDecorator } from 'src/common/swagger/swagger.decorator';
import { sendLmsOpts, sendSmsOpts } from '../swagger/swagger.metadata';
import { ErrorHandlerService } from 'src/common/exception/handler/error-handler.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('v1')
@UsePipes(new ValidationPipe({ transform: true }))
export class SmsController {
    constructor(
        private readonly smsService: SmsService,
        private readonly logger: LoggerService,
        private readonly errHandler: ErrorHandlerService,
    ) {
        this.logger.setContext(SmsController.name);
    }

    // Send SMS API
    @Post('sms')
    @CustomSwaggerDecorator(sendSmsOpts)
    async sendSms(@Body() sendSmsDto: SendSmsDto): Promise<ControllerResponse<SendMsgResDto>> {
        try {
            const sendSmsResDto = await this.smsService.sendSMS(sendSmsDto);
            const cResponse = ControllerResponse.create<SendMsgResDto>(SEND_REQ_COMPLETED, sendSmsResDto);

            return cResponse;
        } catch (error) {
            throw this.errHandler.handleError(error);
        }
    }

    // Send LMS API
    @Post('lms')
    @CustomSwaggerDecorator(sendLmsOpts)
    async sendLms(@Body() sendLmsDto: SendLmsDto): Promise<ControllerResponse<SendMsgResDto>> {
        try {
            const sendLmsResDto = await this.smsService.sendLMS(sendLmsDto);
            const cResponse = ControllerResponse.create<SendMsgResDto>(SEND_REQ_COMPLETED, sendLmsResDto);

            return cResponse;
        } catch (error) {
            throw this.errHandler.handleError(error);
        }
    }
}
