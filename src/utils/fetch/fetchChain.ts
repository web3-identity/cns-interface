import { isEqual } from 'lodash-es';
import { isFunction, isPromise } from '../is';

interface FetchParams {
  rpcUrl?: string;
  method?: string;
  params?: any;
  equalKey?: string;
}

const equalMap = new Map<string, any>();

export function fetchChain<T extends any>(fetcher: () => Promise<any>, equalKey?: string): Promise<T>;
export function fetchChain<T extends any>(fetchParams: Omit<FetchParams, 'equalKey'>, equalKey?: string): Promise<T>;
export function fetchChain() {
  const param: FetchParams | (() => Promise<any>) = arguments[0];
  const equalKey: string = arguments[1];

  let fetcher: Promise<any>;
  if (isFunction(param)) {
    fetcher = param();
  } else {
    const { rpcUrl, method, params } = param;
    fetcher = fetch(rpcUrl ?? import.meta.env.VITE_CoreSpaceRpcUrl, {
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: method ?? 'cfx_call',
        params,
        id: 1,
      }),
      headers: { 'content-type': 'application/json' },
      method: 'POST',
    })
      .then((response) => response.json())
      .then((res) => res?.result);
  }

  if (isPromise(fetcher)) {
    return fetcher.then((result) => {
      if (typeof equalKey !== 'string') return result;

      const lastResult = equalMap.get(equalKey);
      if (isEqual(lastResult, result)) {
        throw new Error('fetchChain: equal');
      } else {
        equalMap.set(equalKey, result);
        return result;
      }
    });
  }
}

export function intervalFetchChain<T extends any>(fetcher: () => Promise<any>, conf: { intervalTime: number; callback: (res: T) => void; equalKey?: string }): VoidFunction;
export function intervalFetchChain<T extends any>(fetchParams: FetchParams, conf: { intervalTime: number; callback: (res: T) => void; equalKey?: string }): VoidFunction;
export function intervalFetchChain() {
  const conf: { intervalTime: number; callback: (res: any) => void; equalKey?: string } = arguments[1];
  if (typeof conf?.callback !== 'function' || typeof conf?.intervalTime !== 'number') return () => {};

  fetchChain(arguments[0], conf?.equalKey)
    .then(conf.callback)
    .catch(() => {});

  const interval = setInterval(
    () =>
      fetchChain(arguments[0], conf?.equalKey)
        .then(conf.callback)
        .catch(() => {}),
    conf.intervalTime
  ) as unknown as number;

  return () => {
    if (interval !== null) {
      clearInterval(interval);
    }
  };
}
