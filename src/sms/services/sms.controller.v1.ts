import { Body, Controller, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SendSmsDto } from '../dtos/request.dto';
import { SendSmsResDto } from '../dtos/response.dto';
import { ControllerResponse } from 'src/common/response/dto/controller-response.dto';
import { SEND_REQ_COMPLETED } from '../types';
import { LoggerService } from 'src/common/logger/logger.service';
import { CustomSwaggerDecorator } from 'src/common/swagger/swagger.decorator';
import { sendSmsOpts } from '../swagger/swagger.metadata';
import { ErrorHandlerService } from 'src/common/exception/handler/error-handler.service';

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

    // 로그인 계정(ID) 중복확인
    @Post('sms')
    @CustomSwaggerDecorator(sendSmsOpts)
    async sendSms(@Body() sendSmsDto: SendSmsDto): Promise<ControllerResponse<SendSmsResDto>> {
        try {
            const sendSmsResDto = await this.smsService.sendSms(sendSmsDto);
            const cResponse = ControllerResponse.create<SendSmsResDto>(SEND_REQ_COMPLETED, sendSmsResDto);

            return cResponse;
        } catch (error) {
            throw this.errHandler.handleError(error);
        }
    }
}
