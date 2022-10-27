import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { Web3Controller, PublicResolver } from '@contracts/index';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { yearsToSeconds } from '@utils/date';
import { getCommitInfo } from '@service/domainRegister/commit';
import { getPayPrice } from '@service/domainRegister/pay';

interface Params {
  domain: string;
  durationYears: number;
}

export const web3Pay = async ({ domain, durationYears }: Params) => {
  try {
    const durationSeconds = yearsToSeconds(durationYears);
    const account = getAccount();
    const hexAccount = getHexAccount();
    const commitInfo = getCommitInfo(domain);
    const payPrice = getPayPrice(domain);
    
    const params = [domain, hexAccount, durationSeconds, commitInfo.secret, PublicResolver.hexAddress, [], true, 0, 1659467455 + durationSeconds];
    
    const txHash = await sendTransaction({
      data: Web3Controller.func.encodeFunctionData('register', params),
      from: account!,
      to: Web3Controller.address,
      value: payPrice.toHexMinUnit()
    });
    
    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    const res = await receiptPromise;
    console.log(res);
  } catch (err) {
    console.error('err', err);
  }
};