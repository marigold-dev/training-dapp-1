/**
 * @packageDocumentation
 * @module @taquito/http-utils
 */
import { STATUS_CODE } from './status_code';
export * from './status_code';
export { VERSION } from './version';
declare type ObjectType = Record<string, any>;
export interface HttpRequestOptions {
    url: string;
    method?: 'GET' | 'POST';
    timeout?: number;
    json?: boolean;
    query?: ObjectType;
    headers?: {
        [key: string]: string;
    };
    mimeType?: string;
}
/**
 *  @category Error
 *  @description This error will be thrown when the endpoint returns an HTTP error to the client
 */
export declare class HttpResponseError extends Error {
    message: string;
    status: STATUS_CODE;
    statusText: string;
    body: string;
    url: string;
    name: string;
    constructor(message: string, status: STATUS_CODE, statusText: string, body: string, url: string);
}
/**
 *  @category Error
 *  @description Error that indicates a general failure in making the HTTP request
 */
export declare class HttpRequestFailed extends Error {
    errorDetail: string;
    name: string;
    constructor(errorDetail: string);
}
export declare class HttpBackend {
    private timeout;
    constructor(timeout?: number);
    protected serialize(obj?: ObjectType): string;
    /**
     *
     * @param options contains options to be passed for the HTTP request (url, method and timeout)
     */
    createRequest<T>({ url, method, timeout, query, headers, json }: HttpRequestOptions, data?: object | string): Promise<T>;
}
