// NestJs
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
// 3rd parth
import { ClsService } from 'nestjs-cls';
// Custom modules
import { NcpMesasgeException } from './NcpMesasgeException';
import { NCP_BAD_REQUEST, NCP_SERVER_ERROR } from '../types';
import { LoggerService } from 'src/common/logger/logger.service';
import { GlobalErrorDto } from 'src/common/exception/dto';
import { BaseResponse } from 'src/common/response/dto/base-response.dto';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'src/common/exception/types/http.type';

// INFO: Global NCP API Exception filter
@Catch(NcpMesasgeException)
export class NcpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly cls: ClsService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext(NcpExceptionFilter.name);
    }

    // NOTE: another Exception could be added
    catch(exception: NcpMesasgeException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const requestId = this.cls.get('requestId') ?? 'Request ID undefined';

        let errName = 'NcpError';
        let info = null;
        let errMessage = '';

        // ncp api exception handling
        if (exception instanceof NcpMesasgeException) {

            errName = exception.name;
            errMessage = exception.message;
            if(exception.status === 400){ // 400 -> 400
                info = NCP_BAD_REQUEST;
            }else{ // the other -> 500
                info = NCP_SERVER_ERROR;
            }

            this.logger.error('NCP API request ID:', exception.requestId);
        }

        this.logger.error(
            `Request Error - ID: ${requestId}, ${errName}: ${errMessage}`,
            exception.stack || '',
        );

        const errDto = GlobalErrorDto.create(info.message);
        const errResponse = BaseResponse.create(requestId, info, errDto);

        response.status(errResponse.responseInfo.status).json(errResponse);
    }
}
