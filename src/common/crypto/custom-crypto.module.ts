import { Module } from '@nestjs/common';
import { TokenUtilityService } from './services/token-utility.service';
import { KeyService } from './services/key.service';

@Module({
    providers: [KeyService, TokenUtilityService],
    exports: [TokenUtilityService],
})
export class CustomCryptoModule {}
