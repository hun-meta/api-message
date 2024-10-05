import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { ControllerResponse } from 'src/common/response/dto/controller-response.dto';
import { DefaultDto, HealthCheckDto } from '../dtos/default.dto';
import { SUCCESS_RES } from '../types';
import { CustomSwaggerDecorator } from 'src/common/swagger/swagger.decorator';
import { getDefaultResponseOpts, getHealthOpts } from '../swagger/swagger.metadata';
import { Public } from 'src/common/request/request.guard';

// NOTE:
// 1. Routing
// 2. Request data collection and validation
// 3. Call Service
// 4. Send Response
@Controller()
@UsePipes(new ValidationPipe({ transform: true }))
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext(AppController.name);
    }

    @Public()
    @Get()
    @CustomSwaggerDecorator(getDefaultResponseOpts)
    async getDefaultResponse(): Promise<ControllerResponse<DefaultDto>> {
        const data = this.appService.getDefaultResponse();
        const response = ControllerResponse.create<DefaultDto>(SUCCESS_RES, data);

        return response;
    }

    @Public()
    @Get('v1/health')
    @CustomSwaggerDecorator(getHealthOpts)
    getHealth(): ControllerResponse<HealthCheckDto> {
        const data = this.appService.getHealth();
        const response = ControllerResponse.create<HealthCheckDto>(SUCCESS_RES, data);

        return response;
    }
}

