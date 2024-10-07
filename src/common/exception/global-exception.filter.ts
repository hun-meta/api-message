// all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { GlobalErrorDto } from './dto';
import {
    BAD_REQUEST,
    CONFLICT,
    FORBIDDEN,
    GONE,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    NOT_IMPLEMENTED,
    PAYLOAD_TOO_LARGE,
    SERVICE_UNAVAILABLE,
    UNAUTHORIZED,
    UNPROCESSABLE_ENTITY,
    UNSUPPORTED_MEDIA_TYPE,
} from './types/http.type';
import { ClsService } from 'nestjs-cls';
import { LoggerService } from '../logger/logger.service';
import { BaseResponse } from '../response/dto/base-response.dto';
import { ResponseInfo } from '../response/types';
import { CustomUndefinedError, CustomUnExpectedError } from './errors';
import { UNDEFINED_ERROR, UNEXPECTED_ERROR } from './types/extra.type';

// INFO: 전역 에러 핸들링 필터(http 에러)
@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly cls: ClsService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext(GlobalExceptionsFilter.name);
    }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        // const request = ctx.getRequest<Request>();

        let errName = 'Error';
        let errMessage = 'Internal server error';
        let stack = '';
        let info = INTERNAL_SERVER_ERROR;
        const requestId = this.cls.get('requestId') ?? 'Request ID undefined';

        // get StackTrace
        if (exception instanceof Error) {
            errName = exception.name;
            stack = exception.stack || '';
        }

        // http exception handling
        if (exception instanceof HttpException) {
            [info, errMessage] = getHttpErrorInfo(exception);
        } else if (exception instanceof CustomUnExpectedError) {
            info = UNEXPECTED_ERROR;
            this.logger.error(`Request Error - ID: ${requestId}, UnDefinedError Occured`);
        } else if (exception instanceof CustomUndefinedError) {
            info = UNDEFINED_ERROR;
            this.logger.error(`Request Error - ID: ${requestId}, UnExpectedError Occured`);
        }
        this.logger.error(`Request Error - ID: ${requestId}, ${errName}: ${errMessage}`, stack, exception);

        const errDto = GlobalErrorDto.create(errMessage);
        const errResponse = BaseResponse.create(requestId, info, errDto);

        response.status(errResponse.responseInfo.status).json(errResponse);
    }
}

// HTTP 에러에 따른 핸들링 메소드
function getHttpErrorInfo(exception: HttpException): [ResponseInfo, string] {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    let message =
        typeof exceptionResponse === 'string'
            ? exceptionResponse
            : (exceptionResponse as any).message || exception.message;
    let info: ResponseInfo = null;

    switch (status) {
        case HttpStatus.BAD_REQUEST:
            const exceptionResponse = exception.getResponse() as any;
            if (Array.isArray(exceptionResponse.message)) {
                message = exceptionResponse.message.join(', ');
            }
            info = BAD_REQUEST;
            break;
        case HttpStatus.UNAUTHORIZED:
            info = UNAUTHORIZED;
            break;
        case HttpStatus.FORBIDDEN:
            info = FORBIDDEN;
            break;
        case HttpStatus.NOT_FOUND:
            info = NOT_FOUND;
            break;
        case HttpStatus.CONFLICT:
            info = CONFLICT;
            break;
        case HttpStatus.GONE:
            info = GONE;
            break;
        case HttpStatus.PAYLOAD_TOO_LARGE:
            info = PAYLOAD_TOO_LARGE;
            break;
        case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
            info = UNSUPPORTED_MEDIA_TYPE;
            break;
        case HttpStatus.UNPROCESSABLE_ENTITY:
            info = UNPROCESSABLE_ENTITY;
            break;
        case HttpStatus.INTERNAL_SERVER_ERROR:
            info = INTERNAL_SERVER_ERROR;
            break;
        case HttpStatus.NOT_IMPLEMENTED:
            info = NOT_IMPLEMENTED;
            break;
        case HttpStatus.SERVICE_UNAVAILABLE:
            info = SERVICE_UNAVAILABLE;
            break;
        default:
            info = INTERNAL_SERVER_ERROR;
    }

    return [info, message];
}
