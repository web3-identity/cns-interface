import { getAccount, sendTransaction } from '@service/account';
import { getNameHash } from '@utils/domainHelper';
import { PublicResolver } from '@contracts/index';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { hideAllModal } from '@components/showPopup';
import { chainsType, chainsEncoder, setDomainRegistrarStatusUpdate, getDomainRegistrar, type Chain } from './';

export const setRegistrarAddress = async ({ domain, chain, address }: { domain: string; chain: Chain; address: string }) => {
  try {
    const account = getAccount();

    const txHash = await sendTransaction({
      data: PublicResolver.func.encodeFunctionData('setAddr', [getNameHash(domain + '.web3'), chainsType[chain], chainsEncoder[chain].decode(address?.trim())]),
      from: account!,
      to: PublicResolver.address,
    });
    setDomainRegistrarStatusUpdate(domain);

    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    hideAllModal();
    await getDomainRegistrar(domain);
  } catch (_) {
    console.log('setRegistrarAddress err', _);
  }
};

const createZeroAddress = (chain: Chain) => chain === 'Ethereum/Conflux eSpace' ? '0x0000000000000000000000000000000000000000' : '0x';
export const setMultiRegistrarAddress = async ({ domain, data }: { domain: string; data: Array<{ chain: Chain; address: string }> }) => {
  try {
    const account = getAccount();
    const allRegistrar = data.map(({ chain, address }) => {
      return PublicResolver.func.encodeFunctionData('setAddr', [getNameHash(domain + '.web3'), chainsType[chain], !(address?.trim()) ? createZeroAddress(chain) : chainsEncoder[chain].decode(address?.trim())]);
    });
    const txHash = await sendTransaction({
      data: PublicResolver.func.encodeFunctionData('multicall', [allRegistrar]),
      from: account!,
      to: PublicResolver.address,
    });
    setDomainRegistrarStatusUpdate(domain);

    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    hideAllModal();
    await getDomainRegistrar(domain);
  } catch (_) {
    console.log('setMultiRegistrarAddress err', _);
  }
};
