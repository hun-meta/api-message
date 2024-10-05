// swagger.metadata.ts
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'src/common/exception/types/http.type';
import { createBody, createSwaggerOptions } from '../../common/swagger/swagger.decorator';
import { SUCCESS_RES } from '../types';

export const getDefaultResponseOpts = createSwaggerOptions({
    summary: 'return datetime, for testing server(Default Path)',
    responses: [
        {
            status: 200,
            description: 'request success',
            schema: {
                example: createBody(SUCCESS_RES, {
                    responseStr: 'Welcome to API - Auth\n<DateTime>',
                }),
            },
        },
    ],
});

export const getHealthOpts = createSwaggerOptions({
    summary: 'AWS Health Check Path',
    responses: [
        {
            status: 200,
            description: 'request success',
            schema: {
                example: createBody(SUCCESS_RES, { responseStr: '<DateTime>' }),
            },
        },
    ],
});
