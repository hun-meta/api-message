import { IsString } from 'class-validator';

export class SendSmsResDto {
    @IsString()
    requestId: string; // ncp sms service request ID

    static create(requestId: string): SendSmsResDto {
        const dto = new SendSmsResDto();
        dto.requestId = requestId;

        return dto;
    }
}
