// NestJS
import { NestFactory } from '@nestjs/core';

// 3rd Party
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

// Custom Modules
import { AppModule } from './app/app.module';

async function bootstrap() {
    // Loggin Start Time
    const currentDate = new Date();
    const unixTime = Math.floor(currentDate.getTime() / 1000);
    console.log(
        `\nStarting API-Message NestJS Application..\nExecution Date and Time: ${currentDate.toLocaleString()}\nUnix Time: ${unixTime}\n`,
    );

    const ABORT_ON_ERROR = process.env.ABORT_ON_ERROR === 'true';
    const app = await NestFactory.create(AppModule, {
        abortOnError: ABORT_ON_ERROR,
        logger: false,
    });

    // Set Global Prefix for API-AUTH
    app.setGlobalPrefix('api/message');

    // Set Swagger docs
    const config = new DocumentBuilder()
        .setTitle('API 문서')
        .setDescription('API 설명서입니다.')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('API')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/message/docs', app, document);

    await app.listen(3000);
}
bootstrap();
