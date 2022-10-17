import { HttpProvider } from '@utils/contracts';

type TranscationReceipt = Awaited<ReturnType<typeof HttpProvider.getTransactionReceipt>>;

export const isTransactionReceipt = async (transactionHash: string) => {
  const txReceipt = await HttpProvider.getTransactionReceipt(transactionHash);
  if (txReceipt && txReceipt.blockNumber) {
    return txReceipt;
  }
  return null;
};

const waitTwoSeconds = () => new Promise((resolve) => setTimeout(resolve, 2000));

const waitTransactionReceipt = async (transactionHash: string, waitTime: number = 44000): Promise<TranscationReceipt> => {
  return new Promise<TranscationReceipt>(async (resolve, reject) => {
    const retryTimes = Array.from({ length: Math.floor(waitTime / 2000) });
    for await (const _ of retryTimes) {
      const txReceipt = await isTransactionReceipt(transactionHash);
      if (txReceipt !== null) {
        resolve(txReceipt);
        return;
      }
      await waitTwoSeconds();
    }
    reject(new Error('Transaction timeout'));
  });
};

export default waitTransactionReceipt;
