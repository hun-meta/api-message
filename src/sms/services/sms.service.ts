import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as crypto from 'crypto';
import { SendSmsDto } from '../dtos/request.dto';
import { CheckAccountResDto } from '../dtos/response.dto';
import { UsersMWRepository } from 'src/orm/repositories/users_medicalwallet.repository';
import { TypeORMError } from 'typeorm';
import { DatabaseException } from 'src/orm/DatabaseException';
import { LoggerService } from 'src/common/logger/logger.service';
import { AccountTokenService } from 'src/common/crypto/token.service';
import { ConfigService } from '@nestjs/config';
import { SendSmsResDto } from '../dtos/response.dto';
import { NcpSmsDto } from '../dtos/api-response.dto';
import { EnvUndefinedError } from 'src/common/exception/errors';
import { API, AxiosError } from 'src/common/third-party-api/api';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class SmsService extends API{

    private naverServiceId: string; // NCP project Service ID
    private accessKey: string; // NCP project Access Key
    private secretKey: string; // NCP project Secret
    private from: string; // Registered NCP Sender number

    constructor(
        private readonly logger: LoggerService,
        private readonly configService: ConfigService,
        private readonly accountService: AccountTokenService,
        private readonly usersMWRepository: UsersMWRepository
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

    async sendSMS(sendSmsDto: SendSmsDto): Promise<SendSmsResDto> {
        try {
            
            // const body: NcpSmsDto = await

            let requestId = ''; // temp value
            return SendSmsResDto.create(requestId);
        } catch (error) {
            if (error instanceof TypeORMError) {
                throw new DatabaseException(error);
            }
            throw error;
        }
    }

    private async sendMessage(type: string, taget: string, message: string): Promise<NcpSmsDto> {

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
                    to: taget
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
                this.logger.debug('axios error from ncp sms:', error);
                const asxiosError = error as AxiosError<NcpSmsDto>;
                const response = asxiosError.response;
                // TODO: NcpException 정의, 및 NCP Filter 구현
                switch (response.status) {
                    case 400:
                      return [null, new ServiceApiError(BAD_REQUEST_ERROR, data.error)];
                    case 401:
                      return [null, new ServiceApiError(INVALID_TOKEN_ERROR, data.error)];
                    case 404:
                      return [null, new ServiceApiError(NOT_FOUND_ERROR, data.error)];
                    case 500:
                      return [null, new ServiceApiError(SERVER_ERROR, data.error)];
                    default:
                      return [null, new ServiceApiError(HTTP_ERROR, data.error)];
                }
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

    /**
     * return third party api url
     *
     * @param type - one of 'sms', 'lms', 'mms'
     * @returns return url string
     */
    private getServiceUrl(type: string): string{
        switch(type){
            case 'sms':
                return this.configService.get<string>('NAVER_SMS_URL');
            default:
                return this.configService.get<string>('NAVER_SMS_URL');
            // NOTE: 기능 구현 예정
            // case 1:
        
                // return this.configService.get<string>('NAVER_LMS_URL');
            
            // case 2:
        
                // return this.configService.get<string>('NAVER_MMS_URL');
        }
    }
}
