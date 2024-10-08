import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import { SendSmsDto } from '../dtos/request.dto';
import { LoggerService } from 'src/common/logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { SendSmsResDto } from '../dtos/response.dto';
import { NcpSmsDto } from '../dtos/api-response.dto';
import { EnvUndefinedError } from 'src/common/exception/errors';
import { API, AxiosError } from 'src/common/third-party-api/api';
import { NcpMesasgeException } from '../NcpMesasgeException';
import { NCP_BAD_REQUEST, NCP_FORBIDDEN, NCP_NOT_FOUND, NCP_SERVER_ERROR, NCP_TOO_MANY, NCP_UNAUTHORIZED } from '../types';

@Injectable()
export class SmsService extends API{

    private naverServiceId: string; // NCP project Service ID
    private accessKey: string; // NCP project Access Key
    private secretKey: string; // NCP project Secret
    private from: string; // Registered NCP Sender number

    constructor(
        private readonly logger: LoggerService,
        private readonly configService: ConfigService,
    ) {
        super();

        const ncpSmsUrl = this.configService.get<string>('NAVER_SMS_URL');
        this.initialBaseUrl(ncpSmsUrl);
        this.logger.setContext(SmsService.name);

        this.naverServiceId = this.configService.get<string>('NAVER_SMS_ID');
        this.accessKey = this.configService.get<string>('NAVER_SMS_ACCESS');
        this.secretKey = this.configService.get<string>('NAVER_SMS_SECRET');
        this.from = this.configService.get<string>('SENDER_PHONE');

        if(!this.naverServiceId || !this.accessKey || !this.secretKey || !this.from){
            throw new EnvUndefinedError(['NAVER_SMS_ID', 'NAVER_SMS_ACCESS', 'NAVER_SMS_SECRET', 'SENDER_PHONE']);
        }
    }

    /**
     * send SMS message
     *
     * @param sendSmsDto - API DTO
     * @returns return response body DTO if process success
     */
    async sendSMS(sendSmsDto: SendSmsDto): Promise<SendSmsResDto> {
        const type = 'sms'
        const target = sendSmsDto.mobile;
        const message = sendSmsDto.message;

        try {
            const body = await this.sendMessage(type, target, message);

            return SendSmsResDto.create(body.requestId);
        } catch (error) {
            throw error;
        }
    }

    /**
     * send some type of message via NCP SMS API
     *
     * @param type - one of 'sms', 'lms', 'mms'
     * @param target - receiver's phone number
     * @param message - message content to send
     * @returns return response body if request success
     */
    private async sendMessage(type: string, target: string, message: string): Promise<NcpSmsDto> {

        if(!this.isValidType(type)){
            throw new InternalServerErrorException('Invalid NCP Message Type');
        }

        const timestamp = Date.now().toString();
        const endpoint = `/services/${this.naverServiceId}/messages`;

        // create Signature for NCP SMS API
        const method = "POST";
        const space = " ";
        const newLine = "\n";
        const hmac = crypto.createHmac('sha256', this.secretKey);
        hmac.update(method + space + `/{type}/v2/services/${this.naverServiceId}/messages` + newLine + timestamp + newLine + this.accessKey);
        const signature = hmac.digest('base64');

        const requestBody = {
            type: type,
            contentType: "COMM",
            countryCode: "82",
            from: this.from,
            content: message,
            messages: [
                {
                    to: target
                }
            ]
        };

        const headers = {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': this.accessKey,
            'x-ncp-apigw-signature-v2': signature
        };

        const postConfig = this.createPostConfig(endpoint, requestBody, headers);

        try{
            const response = await this.request<NcpSmsDto>(postConfig);
            const data = response.data;
            return data;
        }catch(error){
            if(error instanceof Error){
                this.logger.debug('axios error from ncp sms:', error); // TODO: 확인 후 삭제
                const asxiosError = error as AxiosError<NcpSmsDto>;
                const response = asxiosError.response;
                const requestId = response.data.requestId || 'undefined';
                // TODO: create NcpException Filter
                switch (response.status) {
                    case 400:
                        throw new NcpMesasgeException(NCP_BAD_REQUEST, requestId);
                    case 401:
                        throw new NcpMesasgeException(NCP_UNAUTHORIZED, requestId);
                    case 403:
                        throw new NcpMesasgeException(NCP_FORBIDDEN, requestId);
                    case 404:
                        throw new NcpMesasgeException(NCP_NOT_FOUND, requestId);
                    case 429:
                        throw new NcpMesasgeException(NCP_TOO_MANY, requestId);
                    case 500:
                    default:
                        throw new NcpMesasgeException(NCP_SERVER_ERROR, requestId);
                }
            }else{
                throw error;
            }
        }

    }

    /**
     * Check it's validate type for NCP Message Service
     *
     * @param type - one of 'sms', 'lms', 'mms'
     * @returns return true if it's valid
     */
    private isValidType(type: string): boolean{

        if(typeof type !== 'string'){
            return false;
        }
        if(!['sms', 'lms', 'mms'].includes(type)){
            return false;
        }

        return true;
    }
}
