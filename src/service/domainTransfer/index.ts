import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { useDomainOwner } from '@service/domainInfo';
import { getNameHash } from '@utils/domainHelper';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { validateCfxAddress, convertCfxToHex } from '@utils/addressUtils';
import { NameWrapper } from '@contracts/index';
import { hideAllModal } from '@components/showPopup';

export const domainTransfer = async ({ domain, newOwnerAddress, refreshDomainOwner }: { domain: string; newOwnerAddress: string; refreshDomainOwner: VoidFunction; }) => {
  try {
    if (validateCfxAddress(newOwnerAddress)) {
      newOwnerAddress = convertCfxToHex(newOwnerAddress);
    } else {
    }

    const account = getAccount();
    const hexAccount = getHexAccount();

    const txHash = await sendTransaction({
      data: NameWrapper.func.encodeFunctionData('safeTransferFrom', [hexAccount, newOwnerAddress, getNameHash(domain + '.web3'), 1, '0x']),
      from: account!,
      to: NameWrapper.address,
    });

    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    hideAllModal();
    refreshDomainOwner();
  } catch (_) {
    console.log('domainTranster err', _);
  }
};
