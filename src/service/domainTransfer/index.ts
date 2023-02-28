import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { getNameHash } from '@utils/domainHelper';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { validateCfxAddress, convertCfxToHex } from '@utils/addressUtils';
import { NameWrapper } from '@contracts/index';
import { recordToHidePopup } from '@components/showPopup';

export const domainTransfer = async ({ domain, transferAddress, refresh }: { domain: string; transferAddress: string; refresh: VoidFunction }) => {
  try {
    const hidePopup = recordToHidePopup();
    if (validateCfxAddress(transferAddress)) {
      transferAddress = convertCfxToHex(transferAddress);
    }

    const account = getAccount();
    const hexAccount = getHexAccount();

    const txHash = await sendTransaction({
      data: NameWrapper.func.encodeFunctionData('safeTransferFrom', [hexAccount, transferAddress, getNameHash(domain + '.web3'), 1, '0x']),
      from: account!,
      to: NameWrapper.address,
    });

    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    refresh?.();
    hidePopup();
  } catch (_) {
    console.log('domainTranster err', _);
  }
};
