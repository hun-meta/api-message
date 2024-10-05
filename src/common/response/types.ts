// INFO: Response Interceptor에서 사용할 타입
export type ResponseInfo = {
    status: number; // HTTP 상태 코드
    returnCode: number; // 커스텀 응답 코드
    message: string; // 응답 메시지
};

// 상수 정의 예시
const SUCCESS_RES: ResponseInfo = {
    status: 200,
    returnCode: 0,
    message: 'Request Success',
};