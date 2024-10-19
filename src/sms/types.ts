import { ResponseInfo } from 'src/common/response/types';

// Message Send Request Succes(doesn't mean sent)
export const SEND_REQ_COMPLETED: ResponseInfo = {
    status: 202,
    returnCode: 0,
    message: 'Message Send Requested',
};

export const NCP_BAD_REQUEST: ResponseInfo = {
    status: 400,
    returnCode: 21201,
    message: 'NCP api Bad Request',
};

export const NCP_UNAUTHORIZED: ResponseInfo = {
    status: 401,
    returnCode: 21202,
    message: 'NCP api Unauthorized',
};

export const NCP_FORBIDDEN: ResponseInfo = {
    status: 403,
    returnCode: 21203,
    message: 'NCP api Forbidden',
};

export const NCP_NOT_FOUND: ResponseInfo = {
    status: 404,
    returnCode: 21204,
    message: 'NCP api Not found',
};

export const NCP_TOO_MANY: ResponseInfo = {
    status: 429,
    returnCode: 21205,
    message: 'NCP api Too Many Requests',
};

export const NCP_SERVER_ERROR: ResponseInfo = {
    status: 500,
    returnCode: 21206,
    message: 'NCP api Internal Server Error',
};
