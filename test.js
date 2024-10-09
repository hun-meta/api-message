const crypto = require('crypto');
const axios = require('axios');

const smsUrl = 'https://sens.apigw.ntruss.com/sms/v2';
const naverServiceId = 'ncp:sms:kr:334089178397:kp-medicals';
const accessKey = 'ncp_iam_BPAMKR2hrPeR7jn8tz1K';
const secretKey = 'ncp_iam_BPKMKRQQbqkChaoTpgGM1OGv1D28nGkvmO';
const from = '01034557205';

async function sendSMS(mobile, msg, type) {

    const message = msg;

    // Naver SMS API 호출 작업
    const timestamp = Date.now().toString();
    const url = `${smsUrl}/services/${naverServiceId}/messages`;

    // Signature 생성
    const method = "POST";
    const space = " ";
    const newLine = "\n";
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(method + space + `/sms/v2/services/${naverServiceId}/messages` + newLine + timestamp + newLine + accessKey);
    const signature = hmac.digest('base64');

    const requestBody = {
        type: type,
        contentType: "COMM",
        countryCode: "82",
        from: from,
        content: message,
        messages: [
            {
                to: mobile
            }
        ]
    };

    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-signature-v2': signature
    };

    try {
        const response = await axios.post(url, requestBody, { headers });
        if (response.status === 202 && response.data.statusCode === '202') {
            console.log('success');
            return [null, 'success']; // 요청이 성공하면 응답을 반환
        } else {
            console.log('fail response: %o', response);
            let myError = new Error("SMS API not working");
            return [myError, null];
        }
    } catch (error) {
        console.log('fail error: %o', error);
        // 오류가 발생하면 오류 메시지를 반환
        return [error, null];
    }
}

sendSMS('01034557205', 'test message', 'sms');