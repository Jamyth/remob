import axios from "axios";
import type { AxiosError, Method, AxiosRequestConfig } from "axios";
import { NetworkConnectionException } from "../exception/NetworkException";
import { JSONUtil } from "./JSONUtil";
import { APIException } from "../exception/APIException";

export type PathParams<T extends string> = string extends T
    ? { [key: string]: string | number }
    : T extends `${infer _}:${infer Param}/${infer Rest}`
    ? { [k in Param | keyof PathParams<Rest>]: string | number }
    : T extends `${infer _}:${infer Param}`
    ? { [k in Param]: string | number }
    : object;

export interface APIErrorResponse {
    id?: string | null;
    errorCode?: string | null;
    message?: string | null;
}

const APPLICATION_JSON = "application/json";

axios.defaults.transformResponse = (data, headers) => {
    if (data) {
        // API response may be void, in such case, JSON.parse will throw error
        const contentType = headers?.["content-type"];
        if (contentType?.startsWith(APPLICATION_JSON)) {
            return JSONUtil.parseWithDate(data);
        } else {
            throw new NetworkConnectionException("ajax() response not in JSON format", "");
        }
    } else {
        return data;
    }
};

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            const typedError = error as AxiosError<APIErrorResponse | undefined>;
            const requestURL = typedError.config.url || "-";
            if (typedError.response) {
                const responseData = typedError.response.data;
                // Treat "cloud" error as Network Exception, e.g: gateway/load balancer issue,
                const networkErrorStatusCodes: number[] = [0, 502, 504];
                if (responseData && !networkErrorStatusCodes.includes(typedError.response.status)) {
                    // Try to get server error message/ID/code from response
                    const errorId: string | null = responseData?.id || null;
                    const errorCode: string | null = responseData?.errorCode || null;
                    const errorMessage: string = responseData.message || `[No Response]`;
                    throw new APIException(
                        errorMessage,
                        typedError.response.status,
                        requestURL,
                        responseData,
                        errorId,
                        errorCode,
                    );
                }
            }
            throw new NetworkConnectionException(
                `Failed to connect: ${requestURL}`,
                requestURL,
                `${typedError.code || "UNKNOWN"}: ${typedError.message}`,
            );
        } else if (error instanceof NetworkConnectionException) {
            throw error;
        } else {
            throw new NetworkConnectionException(`Unknown network error`, `[No URL]`, error.toString());
        }
    },
);

async function ajax<Request, Response, Path extends string>(
    method: Method,
    path: Path,
    pathParams: PathParams<Path>,
    request: Request,
    extraConfig: Partial<AxiosRequestConfig> = {},
): Promise<Response> {
    const fullURL = urlParams(path, pathParams);
    const config: AxiosRequestConfig = { ...extraConfig, method, url: fullURL };

    if (method === "GET" || method === "DELETE") {
        config.params = request;
    } else if (method === "POST" || method === "PUT" || method === "PATCH") {
        config.data = request;
    }

    config.headers = {
        "Content-Type": APPLICATION_JSON,
        Accept: APPLICATION_JSON,
    };

    const response = await axios.request<Response>(config);
    return response.data;
}

function uri<Request>(path: string, request: Request): string {
    const config: AxiosRequestConfig = { method: "GET", url: path, params: request };
    return axios.getUri(config);
}

function urlParams(pattern: string, params: object): string {
    if (!params) {
        return pattern;
    }
    let url = pattern;
    Object.entries(params).forEach(([name, value]) => {
        const encodedValue = encodeURIComponent(value.toString());
        url = url.replace(":" + name, encodedValue);
    });
    return url;
}

export const NetworkUtil = Object.freeze({
    ajax,
    uri,
    urlParams,
});
