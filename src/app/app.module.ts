// NestJS
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
// 3rd-party
import { ClsModule, ClsMiddleware } from 'nestjs-cls';
// Custom Modules
import { RequestIdMiddleware } from '../common/request/request-id.middleware';
import { ResponseInterceptor } from 'src/common/response/interceptor/response.interceptor';
import { GlobalExceptionsFilter } from 'src/common/exception/global-exception.filter';
import { winstonLogger } from 'src/common/logger/logger.config';
import { LoggerService } from 'src/common/logger/logger.service';
import { ErrorHandlerModule } from 'src/common/exception/handler/error-handler.module';
import { AppController } from './services/app.controller.v1';
import { AppService } from './services/app.service';
import { RequestGuard } from 'src/common/request/request.guard';
import { SmsController } from 'src/sms/services/sms.controller.v1';
import { SmsModule } from 'src/sms/sms.module';

@Module({
    imports: [
        ClsModule.forRoot({
            global: true,
            middleware: { mount: true },
        }),
        ConfigModule.forRoot({
            envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
            isGlobal: true,
        }),
        winstonLogger,
        ErrorHandlerModule,
        SmsModule
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionsFilter,
        },
        {
          provide: APP_GUARD,
          useClass: RequestGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        LoggerService,
        AppService,
    ],
    exports: [LoggerService, ErrorHandlerModule],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ClsMiddleware, RequestIdMiddleware) // ClsMiddleware가 먼저 동작하도록 설정
            .forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
