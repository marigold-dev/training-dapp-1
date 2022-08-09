"use strict";
/**
 * @packageDocumentation
 * @module @taquito/http-utils
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpBackend = exports.HttpRequestFailed = exports.HttpResponseError = exports.VERSION = void 0;
const axios_1 = require("axios");
__exportStar(require("./status_code"), exports);
var version_1 = require("./version");
Object.defineProperty(exports, "VERSION", { enumerable: true, get: function () { return version_1.VERSION; } });
var ResponseType;
(function (ResponseType) {
    ResponseType["TEXT"] = "text";
    ResponseType["JSON"] = "json";
})(ResponseType || (ResponseType = {}));
/**
 *  @category Error
 *  @description This error will be thrown when the endpoint returns an HTTP error to the client
 */
class HttpResponseError extends Error {
    constructor(message, status, statusText, body, url) {
        super(message);
        this.message = message;
        this.status = status;
        this.statusText = statusText;
        this.body = body;
        this.url = url;
        this.name = 'HttpResponse';
    }
}
exports.HttpResponseError = HttpResponseError;
/**
 *  @category Error
 *  @description Error that indicates a general failure in making the HTTP request
 */
class HttpRequestFailed extends Error {
    constructor(errorDetail) {
        super(errorDetail);
        this.errorDetail = errorDetail;
        this.name = 'HttpRequestFailed';
    }
}
exports.HttpRequestFailed = HttpRequestFailed;
class HttpBackend {
    constructor(timeout = 30000) {
        this.timeout = timeout;
    }
    serialize(obj) {
        if (!obj) {
            return '';
        }
        const str = [];
        for (const p in obj) {
            // eslint-disable-next-line no-prototype-builtins
            if (obj.hasOwnProperty(p) && typeof obj[p] !== 'undefined') {
                const prop = typeof obj[p].toJSON === 'function' ? obj[p].toJSON() : obj[p];
                // query arguments can have no value so we need some way of handling that
                // example https://domain.com/query?all
                if (prop === null) {
                    str.push(encodeURIComponent(p));
                    continue;
                }
                // another use case is multiple arguments with the same name
                // they are passed as array
                if (Array.isArray(prop)) {
                    prop.forEach((item) => {
                        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(item));
                    });
                    continue;
                }
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(prop));
            }
        }
        const serialized = str.join('&');
        if (serialized) {
            return `?${serialized}`;
        }
        else {
            return '';
        }
    }
    /**
     *
     * @param options contains options to be passed for the HTTP request (url, method and timeout)
     */
    createRequest({ url, method, timeout = this.timeout, query, headers = {}, json = true }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let resType;
            let transformResponse = undefined;
            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json';
            }
            if (!json) {
                resType = ResponseType.TEXT;
                transformResponse = [(v) => v];
            }
            else {
                resType = ResponseType.JSON;
            }
            try {
                const response = yield axios_1.default.request({
                    url: url + this.serialize(query),
                    method: method !== null && method !== void 0 ? method : 'GET',
                    headers: headers,
                    responseType: resType,
                    transformResponse,
                    timeout: timeout,
                    data: data,
                });
                return response.data;
            }
            catch (err) {
                if (axios_1.default.isAxiosError(err) && err.response) {
                    let errorData;
                    if (typeof err.response.data === 'object') {
                        errorData = JSON.stringify(err.response.data);
                    }
                    else {
                        errorData = err.response.data;
                    }
                    throw new HttpResponseError(`Http error response: (${err.response.status}) ${errorData}`, err.response.status, err.response.statusText, errorData, url + this.serialize(query));
                }
                else {
                    throw new HttpRequestFailed(err);
                }
            }
        });
    }
}
exports.HttpBackend = HttpBackend;
//# sourceMappingURL=taquito-http-utils.js.map