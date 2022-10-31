import { fetchChain } from '@utils/fetch';

export const isTransactionReceipt = async (transactionHash: string) => {
  const txReceipt: { epochNumber: string; blockHash: string; transactionHash: string; from: string; to: string } = await fetchChain({
    method: 'cfx_getTransactionReceipt',
    params: [transactionHash],
  });

  if (txReceipt && txReceipt.epochNumber) {
    return txReceipt;
  }
  return null;
};

async function* endlessGenerator() {
  let count = 0;
  while (true) {
    yield count++;
  }
}

export const waitSeconds = (seconds: number) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

/**
* @param {Number} maxWaitTime - max wait time in seconds; 0 means endless;
*/
const waitAsyncResult = <T extends () => Promise<any>>(fetcher: T, maxWaitTime: number = 44) => {
  let isStop = false;
  const stop = () => isStop = true;
  const promise = new Promise<NonNullable<Awaited<ReturnType<T>>>>(async (resolve, reject) => {

    const generator = maxWaitTime === 0 ? endlessGenerator() : Array.from({ length: Math.floor(maxWaitTime / 1) });

    for await (const _ of generator) {
      if (isStop) {
        reject(new Error('Wait async stop'));
        return;
      }
      const res = await fetcher();
      if (res) {
        resolve(res);
        return;
      }
      await waitSeconds(3);
    }
    reject(new Error('Wait async timeout'));
  });

  return [promise, stop] as const;
};

export default waitAsyncResult;
