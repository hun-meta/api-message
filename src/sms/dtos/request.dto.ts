import { IsString, Matches, Validate } from 'class-validator';
import { IsByteLengthConstraint } from 'src/common/custom-decorator/validator';

// Send SMS DTO
export class SendSmsDto {

    @IsString()
    @Matches(/^01\d{8,9}$/, {
      message: 'Mobile number must start with 01 and be 10 or 11 digits long.',
    })
    mobile: string;
  
    @IsString()
    @Validate(IsByteLengthConstraint, [90], {
      message: 'Message must be 90 bytes or fewer.',
    })
    @Matches(/^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, {
      message: 'Message contains invalid characters.',
    })
    message: string;
  }