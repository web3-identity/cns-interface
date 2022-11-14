import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { fetchDomainRegistrar } from '@service/domainRegistrar';
import { getNameHash } from '@utils/domainHelper';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { validateCfxAddress, convertCfxToHex } from '@utils/addressUtils';
import { NameWrapper } from '@contracts/index';
import { hideAllModal } from '@components/showPopup';

export const domainTransfer = async ({ domain, transferAddress, refreshDomainOwner }: { domain: string; transferAddress: string; refreshDomainOwner: VoidFunction }) => {
  try {
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
    hideAllModal();
    refreshDomainOwner();
  } catch (_) {
    console.log('domainTranster err', _);
  }
};
