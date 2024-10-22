import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from 'src/common/logger/services/logger.service';
import { JWT_EXPIRED, JWT_INVALID, JWT_VERIFIED } from '../constants/response-info.constants';
import { ResponseInfo } from '../../response/types';
import { KeyService } from './key.service';

@Injectable()
export class TokenUtilityService {
    private readonly publicKey: string;
    constructor(
        private readonly logger: LoggerService,
        private readonly config: ConfigService,
        private readonly keyService: KeyService,
    ) {
        this.logger.setContext(TokenUtilityService.name);
        this.publicKey = this.keyService.getPublicKey();
    }

    /**
     * INFO: Decrypt and verify token
     *
     * @param token - JWT token to be verified
     * @returns ResponseInfo if verification is successful
     */
    verifyToken(token: string): ResponseInfo {
        try {
            const decoded = jwt.verify(token, this.publicKey, { algorithms: ['RS256'] });
            return JWT_VERIFIED;
        } catch (error) {
            if (error instanceof Error) {
                switch (error.name) {
                    case 'TokenExpiredError':
                        return JWT_EXPIRED;
                    case 'JsonWebTokenError':
                        return JWT_INVALID;
                    default:
                        throw error;
                }
            }
            throw error;
        }
    }
}
