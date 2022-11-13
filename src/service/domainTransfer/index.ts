import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { getNameHash } from '@utils/domainHelper';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { convertCfxToHex } from '@utils/addressUtils';
import { NameWrapper } from '@contracts/index';
import { hideAllModal } from '@components/showPopup';

export const domainTransfer = async ({ domain, newOwnerAddress }: { domain: string; newOwnerAddress: string }) => {
  try {
    const account = getAccount();
    //TODO: how if the newOwnerAddress is not a hex address?
    const newOwnerAdd = convertCfxToHex(newOwnerAddress);
    const hexAccount = getHexAccount();
    const txHash = await sendTransaction({
      data: NameWrapper.func.encodeFunctionData('safeTransferFrom', [hexAccount, newOwnerAdd, getNameHash(domain + '.web3'), 1, '0x']),
      from: account!,
      to: NameWrapper.address,
    });
    debugger
    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    hideAllModal();
  } catch (_) {
    console.log('domainTranster err', _);
  }
};
