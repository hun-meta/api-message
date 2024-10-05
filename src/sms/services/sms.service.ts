import { Injectable } from '@nestjs/common';
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

@Injectable()
export class SmsService {

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

    private sendMessage(type: string, taget: string, message: string): Promise<NcpSmsDto> {

        // TODO: Error 처리
        if(!this.isValidType(type)){
            throw new NcpMessageError('invalid type');
        }

        const timestamp = Date.now().toString();
        const url = `${this.getServiceUrl(type)}/services/${this.naverServiceId}/messages`;

        // create Signature for NCP SMS API
        const method = "POST";
        const space = " ";
        const newLine = "\n";
        const hmac = crypto.createHmac('sha256', this.secretKey);
        hmac.update(method + space + `/{type}/v2/services/${naverServiceId}/messages` + newLine + timestamp + newLine + accessKey);
        const signature = hmac.digest('base64');

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
