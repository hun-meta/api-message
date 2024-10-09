import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BaseResponse } from '../response/dto/base-response.dto';

export interface AxiosError<T> {
    message: string;
    name: string;
    status: number;
    code: string;
    config: AxiosRequestConfig;
    request?: any; // XMLHttpRequest or Node.js http.ClientRequest
    response?: {
        status: number;
        statusText: string;
        config: any;
        headers: any;
        request: any;
        data: T;
    };
    stack?: string;
}

// API request http parent class
class API {
    protected axiosInstance: AxiosInstance;
  
    protected initialBaseUrl(url: string){
      this.axiosInstance = axios.create({
        baseURL: url,
      });
    //   this.axiosInstance = axios.create();
    }

    // API 요청 메소드
    protected async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        try {
            const response = await this.axiosInstance.request<T>(config);
            return response;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw error;
            }
        }
    }

    // GET 요청 설정 생성 메소드
    protected createGetConfig(endpoint: string, params?: any, headers?: any): AxiosRequestConfig {
        return {
            method: 'get',
            url: endpoint,
            params: params,
            headers: headers,
        };
    }

    // POST 요청 설정 생성 메소드
    protected createPostConfig(endpoint: string, data?: any, headers?: any): AxiosRequestConfig {
        return {
            method: 'post',
            url: endpoint,
            data: data,
            headers: headers,
        };
    }

    // PUT 요청 설정 생성 메소드
    protected createPutConfig(endpoint: string, data?: any, headers?: any): AxiosRequestConfig {
        return {
            method: 'put',
            url: endpoint,
            data: data,
            headers: headers,
        };
    }

    // PATCH 요청 설정 생성 메소드
    protected createPatchConfig(endpoint: string, data?: any, headers?: any): AxiosRequestConfig {
        return {
            method: 'patch',
            url: endpoint,
            data: data,
            headers: headers,
        };
    }

    // DELETE 요청 설정 생성 메소드
    protected createDeleteConfig(endpoint: string, params?: any, headers?: any): AxiosRequestConfig {
        return {
            method: 'delete',
            url: endpoint,
            params: params,
            headers: headers,
        };
    }
}

export { API };
