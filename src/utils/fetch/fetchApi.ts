import { isEqual } from 'lodash-es';
import { isFunction, isPromise } from '../is';

interface FetchParams {
  path?: string;
  method?: string;
  params?: any;
  equalKey?: string;
}

type RequestParams = Parameters<typeof fetch>[1];

const equalMap = new Map<string, any>();

export function fetchApi<T extends any>(fetcher: () => Promise<any>, equalKey?: string): Promise<T>;
export function fetchApi<T extends any>(fetchParams: Omit<FetchParams, 'equalKey'>, equalKey?: string): Promise<T>;
export function fetchApi() {
  const param: FetchParams | (() => Promise<any>) = arguments[0];
  const equalKey: string = arguments[1];

  let fetcher: Promise<any>;
  if (isFunction(param)) {
    fetcher = param();
  } else {
    let { path, method, params } = param;
    const bodyParams = params ?? {};
    method = method ?? 'GET';
    const requestParams: RequestParams = {
      body: JSON.stringify(bodyParams),
      method: method,
    };
    if (method == 'GET') delete requestParams.body;
    fetcher = fetch(`/v0/${path}`, requestParams).then((response) => response.json());
  }

  if (isPromise(fetcher)) {
    return fetcher.then((result) => {
      if (typeof equalKey !== 'string') return result;

      const lastResult = equalMap.get(equalKey);
      if (isEqual(lastResult, result)) {
        throw new Error('fetchApi: equal');
      } else {
        equalMap.set(equalKey, result);
        return result;
      }
    });
  }
}
