// swagger.metadata.ts
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'src/common/exception/types/http.type';
import { createBody, createSwaggerOptions } from '../../common/swagger/swagger.decorator';
import { SEND_REQ_COMPLETED } from '../types';

export const sendSmsOpts = createSwaggerOptions({
    summary: 'send SMS message via ncp api',
    bearerAuth: true,
    // headers: [
    //     {
    //         name: 'X-TEST-HEADER',
    //         description: 'any value for test',
    //         required: true,
    //         schema: {
    //             type: 'string',
    //             example: 'test value',
    //         },
    //     },
    // ],
    body: {
        description: 'receiver phone number & sms message',
        required: true,
        schema: {
            type: 'object',
            properties: {
                mobile: {
                    type: 'string',
                    description: 'phone number value',
                    example: '01012345678',
                },
                message: {
                    type: 'string',
                    description: 'sms message value',
                    example: 'hello baby',
                },
            },
            required: ['mobile', 'message'],
        },
    },
    responses: [
        {
            status: 202,
            description: 'Message Send Request Completed',
            schema: { example: createBody(SEND_REQ_COMPLETED, { requestId: 'request ID' }) },
        },
        {
            status: 400,
            description: 'Bad Request',
            schema: {
                example: createBody(BAD_REQUEST, {
                    message:
                        'Mobile number must start with 01 and be 10 or 11 digits long. || Message contains invalid characters. || Message must be 90 bytes or fewer. || NCP api Bad Request',
                }),
            },
        },
        {
            status: 401,
            description: 'UnAuthorized',
            schema: {
                example: createBody(UNAUTHORIZED, {
                    message:
                        'Invalid API key || Authorization header is missing',
                }),
            },
        },
        {
            status: 500,
            description: 'Internal Server Error',
            schema: {
                example: createBody(INTERNAL_SERVER_ERROR, {
                    message: 'Internal server error || NCP api Internal Server Error',
                }),
            },
        },
    ],
});
