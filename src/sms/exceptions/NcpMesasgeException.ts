import { ResponseInfo } from 'src/common/response/types';

export class NcpMesasgeException extends Error {
    public readonly name: string;
    public readonly status: number;
    public readonly requestId: string;

    constructor(info: ResponseInfo, ncpRequestId: string) {
        super(info.message);
        this.name = 'NcpMessageException';
        this.status = info.status;
        this.requestId = ncpRequestId;
    }
}
