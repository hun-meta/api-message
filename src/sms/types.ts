import { ResponseInfo } from 'src/common/response/types';

// Message Send Request Succes(doesn't mean sent)
export const SEND_REQ_COMPLETED: ResponseInfo = {
    status: 202,
    returnCode: 0,
    message: 'Message Send Requested',
};
