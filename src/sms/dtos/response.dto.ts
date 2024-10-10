import { IsString } from 'class-validator';

// Message Response DTO (sms, lms, mms)
export class SendMsgResDto {
    @IsString()
    requestId: string; // ncp sms, lms, mms service request ID

    static create(requestId: string): SendMsgResDto {
        const dto = new SendMsgResDto();
        dto.requestId = requestId;

        return dto;
    }
}