import { getAccount, sendTransaction } from '@service/account';
import { formatsByCoinType } from '@utils/addressUtils';
import { getNameHash } from '@utils/domainHelper';
import { PublicResolver } from '@contracts/index';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { hideAllModal } from '@components/showPopup';
import { chainsType, type Chain } from './';

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
    const coinTypeInstance = formatsByCoinType[chainsType[chain]];
    const encodedAddress = coinTypeInstance.decoder(address);

    // console.log(getNameHash(domain + '.web3'), chainsType[chain], encodedAddress)
    const txHash = await sendTransaction({
      data: PublicResolver.func.encodeFunctionData('setAddr', [getNameHash(domain + '.web3'), chainsType[chain], encodedAddress]),
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
      const coinTypeInstance = formatsByCoinType[chainsType[chain]];
      const encodedAddress = coinTypeInstance.decoder(address);
      return PublicResolver.func.encodeFunctionData('setAddr', [getNameHash(domain + '.web3'), chainsType[chain], encodedAddress]);
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
