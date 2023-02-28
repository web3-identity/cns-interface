import { getAccount, sendTransaction } from '@service/account';
import { Web3Controller } from '@contracts/index';
import { yearsToSeconds } from '@utils/date';
import { getPayPrice } from '@service/domainRegister/pay';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { setRenewStep, RenewStep } from '../';

interface Params {
  domain: string;
  durationYears: number;
  refreshDomainExpire: VoidFunction;
}

export const web3Renew = async ({ domain, durationYears, refreshDomainExpire }: Params) => {
  try {
    const durationSeconds = yearsToSeconds(durationYears);
    const account = getAccount();
    const payPrice = getPayPrice(domain);

    const txHash = await sendTransaction({
      data: Web3Controller.func.encodeFunctionData('renew', [domain, durationSeconds]),
      from: account!,
      to: Web3Controller.address,
      value: payPrice.toHexMinUnit(),
    });

    setRenewStep(domain, RenewStep.WaitConfirm);
    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    setRenewStep(domain, RenewStep.Success);
    refreshDomainExpire();
  } catch (err) {
    console.error('err', err);
  }
};
