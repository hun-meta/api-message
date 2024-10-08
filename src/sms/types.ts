import { ResponseInfo } from 'src/common/response/types';

// Message Send Request Succes(doesn't mean sent)
export const SEND_REQ_COMPLETED: ResponseInfo = {
    status: 202,
    returnCode: 0,
    message: 'Message Send Requested',
};

// Message Send Request Succes(doesn't mean sent)
export const NCP_BAD_REQUEST: ResponseInfo = {
    status: 400,
    returnCode: 21001,
    message: 'Bad Request',
};

// Message Send Request Succes(doesn't mean sent)
export const NCP_UNAUTHORIZED: ResponseInfo = {
    status: 401,
    returnCode: 21002,
    message: 'Unauthorized',
};

// Message Send Request Succes(doesn't mean sent)
export const NCP_FORBIDDEN: ResponseInfo = {
    status: 403,
    returnCode: 21003,
    message: 'Forbidden',
};

// Message Send Request Succes(doesn't mean sent)
export const NCP_NOT_FOUND: ResponseInfo = {
    status: 404,
    returnCode: 21004,
    message: 'Not found',
};

// Message Send Request Succes(doesn't mean sent)
export const NCP_TOO_MANY: ResponseInfo = {
    status: 429,
    returnCode: 21005,
    message: 'Too Many Requests',
};

// Message Send Request Succes(doesn't mean sent)
export const NCP_SERVER_ERROR: ResponseInfo = {
    status: 500,
    returnCode: 21006,
    message: 'Internal Server Error',
};
