import { getAccount, sendTransaction } from '@service/account';
import { getNameHash } from '@utils/domainHelper';
import { PublicResolver } from '@contracts/index';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { hideAllModal } from '@components/showPopup';
import { chainsType, chainsEncoder, type Chain } from './';

export const setRegistrarAddress = async ({
  domain,
  chain,
  address,
  handleRefreshRegistrar,
}: {
  domain: string;
  chain: Chain;
  address: string;
  handleRefreshRegistrar: VoidFunction;
}) => {
  try {
    const account = getAccount();

    const txHash = await sendTransaction({
      data: PublicResolver.func.encodeFunctionData('setAddr', [getNameHash(domain + '.web3'), chainsType[chain], chainsEncoder[chain].decode(address)]),
      from: account!,
      to: PublicResolver.address,
    });

    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    hideAllModal();
    handleRefreshRegistrar();
  } catch (_) {
    console.log('setRegistrarAddress err', _);
  }
};

export const setMultiRegistrarAddress = async ({
  domain,
  data,
  handleRefreshRegistrar,
}: {
  domain: string;
  data: Array<{ chain: Chain; address: string }>;
  handleRefreshRegistrar: VoidFunction;
}) => {
  try {
    const account = getAccount();
    const allRegistrar = data.map(({ chain, address }) => {
      return PublicResolver.func.encodeFunctionData('setAddr', [getNameHash(domain + '.web3'), chainsType[chain], chainsEncoder[chain].decode(address)]);
    });

    const txHash = await sendTransaction({
      data: PublicResolver.func.encodeFunctionData('multicall', [allRegistrar]),
      from: account!,
      to: PublicResolver.address,
    });

    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    hideAllModal();
    handleRefreshRegistrar();
  } catch (_) {
    console.log('setMultiRegistrarAddress err', _);
  }
};
