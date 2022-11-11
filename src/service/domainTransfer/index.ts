import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { getNameHash } from '@utils/domainHelper';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { NameWrapper } from '@contracts/index';
import { hideAllModal } from '@components/showPopup';

export const domainTransfer = async ({ domain, newOwnerAddress }: { domain: string; newOwnerAddress: string }) => {
  try {
    const account = getAccount();
    const hexAccount = getHexAccount();
    debugger;
    const txHash = await sendTransaction({
      data: NameWrapper.func.encodeFunctionData('safeTransferFrom', [hexAccount, newOwnerAddress, getNameHash(domain + '.web3'), 1, '0x']),
      from: account!,
      to: NameWrapper.address,
    });
    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    hideAllModal();
  } catch (_) {
    console.log('domainTranster err', _);
  }
};
