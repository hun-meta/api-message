import { IsNotEmpty, IsString, Matches, Validate } from 'class-validator';
import { IsByteLengthConstraint } from 'src/common/decorator/validator';

// Send SMS DTO
export class SendSmsDto {

    @IsNotEmpty()
    @IsString()
    @Matches(/^01\d{8,9}$/, {
      message: 'Mobile number must start with 01 and be 10 or 11 digits long.',
    })
    mobile: string;
  
    @IsNotEmpty()
    @IsString()
    @Validate(IsByteLengthConstraint, [90], {
      message: 'Message must be 90 bytes or fewer.',
    })
    message: string;
}

// Send LMS DTO
export class SendLmsDto {

    @IsNotEmpty()
    @IsString()
    @Matches(/^01\d{8,9}$/, {
        message: 'Mobile number must start with 01 and be 10 or 11 digits long.',
    })
    mobile: string;

    @IsNotEmpty()
    @IsString()
    @Validate(IsByteLengthConstraint, [2000], {
        message: 'Message must be 2000 bytes or fewer.',
    })
    message: string;
}