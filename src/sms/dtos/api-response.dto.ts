// Responses for http request to 3rd Party API
import { IsString } from 'class-validator';

export class NcpSmsDto {
    @IsString()
    requestId: string; // ncp sms service request ID

    @IsString()
    requestTime: string;

    @IsString()
    statusCode: string;

    @IsString()
    statusName: string;
}
