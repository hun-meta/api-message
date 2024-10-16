import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { EnvUndefinedError } from '../exception/errors';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class RequestGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const apiKey = this.configService.get<string>('SMS_API_KEY');
    if (!apiKey) {
      throw new EnvUndefinedError(['SMS_API_KEY']);
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== 'Bearer' || token !== apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}

