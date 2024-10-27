import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SendLmsDto, SendSmsDto } from '../dtos/request.dto';
import { LoggerService } from 'src/common/logger/services/logger.service';
import { ConfigService } from '@nestjs/config';
import { SendMsgResDto } from '../dtos/response.dto';
import { NcpSmsDto } from '../dtos/api-response.dto';
import { EnvUndefinedError } from 'src/common/exception/errors';
import { NcpMesasgeException } from '../exceptions/NcpMesasgeException';
import {
    NCP_BAD_REQUEST,
    NCP_FORBIDDEN,
    NCP_NOT_FOUND,
    NCP_SERVER_ERROR,
    NCP_TOO_MANY,
    NCP_UNAUTHORIZED,
} from '../types';
import axios, { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class SmsService {
    private baseUrl: string; // NCP SMS Service base url
    private naverServiceId: string; // NCP project Service ID
    private accessKey: string; // NCP project Access Key
    private secretKey: string; // NCP project Secret
    private from: string; // Registered NCP Sender number

    constructor(
        private readonly logger: LoggerService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('NAVER_SMS_URL');
        this.naverServiceId = this.configService.get<string>('NAVER_SMS_ID');
        this.accessKey = this.configService.get<string>('NAVER_SMS_ACCESS');
        this.secretKey = this.configService.get<string>('NAVER_SMS_SECRET');
        this.from = this.configService.get<string>('SENDER_PHONE');

        if (!this.naverServiceId || !this.accessKey || !this.secretKey || !this.from) {
            throw new EnvUndefinedError(['NAVER_SMS_ID', 'NAVER_SMS_ACCESS', 'NAVER_SMS_SECRET', 'SENDER_PHONE']);
        }
    }

    /**
     * send SMS message
     *
     * @param sendSmsDto - API DTO
     * @returns return response body DTO if process success
     */
    async sendSMS(sendSmsDto: SendSmsDto): Promise<SendMsgResDto> {
        const type = 'sms';
        const target = sendSmsDto.mobile;
        const message = sendSmsDto.message;

        try {
            const body = await this.sendMessage(type, target, message);

            return SendMsgResDto.create(body.requestId);
        } catch (error) {
            throw error;
        }
    }

    /**
     * send LMS message
     *
     * @param sendSmsDto - API DTO
     * @returns return response body DTO if process success
     */
    async sendLMS(sendLmsDto: SendLmsDto): Promise<SendMsgResDto> {
        const type = 'lms';
        const target = sendLmsDto.mobile;
        const message = sendLmsDto.message;

        try {
            const body = await this.sendMessage(type, target, message);

            return SendMsgResDto.create(body.requestId);
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
    async sendMessage(type: string, target: string, message: string): Promise<NcpSmsDto> {
        try {
            // Naver SMS API Task
            const method = 'POST';
            const fullUrl = `${this.baseUrl}/services/${this.naverServiceId}/messages`;
            const urlPathOnly = this.extractPath(fullUrl);
            const timestamp = Date.now().toString();
            const signature = this.makeSignature(method, urlPathOnly, timestamp);

            const requestBody = {
                type: type,
                contentType: 'COMM',
                countryCode: '82',
                from: this.from,
                content: message,
                messages: [
                    {
                        to: target,
                    },
                ],
            };

            const headers = {
                'Content-Type': 'application/json; charset=utf-8',
                'x-ncp-apigw-timestamp': timestamp,
                'x-ncp-iam-access-key': this.accessKey,
                'x-ncp-apigw-signature-v2': signature,
            };

            const response: AxiosResponse<NcpSmsDto> = await axios.post(fullUrl, requestBody, { headers });
            if (response.status === 202) {
                return response.data; // 요청이 성공하면 응답을 반환
            } else {
                throw response;
            }
        } catch (error) {
            // 오류가 발생하면 오류 메시지를 반환
            if (error instanceof AxiosError) {
                const response: AxiosResponse<NcpSmsDto> = error.response;
                this.logger.debug('response:', response);
                const requestId = response.data.requestId || 'undefined';
                switch (error.status || 500) {
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
            }
            throw error;
        }
    }

    /**
     * Create NCP signature V2
     *
     * @param method_param - one of http method name
     * @param url_param - url.pathname
     * @param timestamp_param - timestamp millisecond string
     * @returns return signatureV2 for NCP
     */
    private makeSignature(method_param: string, url_param: string, timestamp_param: string) {
        const space = ' '; // one space
        const newLine = '\n'; // new line
        const method = method_param; // method
        const url = url_param; // url (include query string)
        const timestamp = timestamp_param;
        const accessKey = this.accessKey; // access key id (from portal or Sub Account)
        const secretKey = this.secretKey; // secret key (from portal or Sub Account)

        // Create the string to sign
        const sigMessage = method + space + url + newLine + timestamp + newLine + accessKey;
        console.log('failed code');
        console.log('signature message: %o', sigMessage);

        // Create the HMAC SHA256 hash
        const hmac = crypto.createHmac('sha256', secretKey);
        hmac.update(sigMessage);

        // Return the Base64-encoded signature
        return hmac.digest('base64');
    }

    /**
     * Get pathname from url
     *
     * @param fullUrl - full url which is Domain + pathname
     * @returns return url.pathname
     */
    private extractPath(fullUrl) {
        try {
            const url = new URL(fullUrl);
            return url.pathname;
        } catch (error) {
            console.error('Invalid URL:', error);
            return null;
        }
    }
}
