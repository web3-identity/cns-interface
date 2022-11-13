import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { useDomainOwner } from '@service/domainInfo';
import { getNameHash } from '@utils/domainHelper';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { validateCfxAddress, convertCfxToHex } from '@utils/addressUtils';
import { NameWrapper } from '@contracts/index';
import { hideAllModal } from '@components/showPopup';

export const domainTransfer = async ({ domain, newOwnerAddress }: { domain: string; newOwnerAddress: string }) => {
  try {
    const account = getAccount();
    if (validateCfxAddress(newOwnerAddress)) {
      newOwnerAddress = convertCfxToHex(newOwnerAddress);
    } else {
      const newOwnerCFXAddress = await useDomainOwner(newOwnerAddress);
      if (!newOwnerCFXAddress) throw new Error('Invalid new owner address');
      newOwnerAddress = convertCfxToHex(newOwnerCFXAddress);
    }
    const hexAccount = getHexAccount();
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
