import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { Web3Controller, PublicResolver } from '@contracts/index';
import { yearsToSeconds } from '@utils/date';
import { getCommitInfo } from '@service/domainRegister/commit';
import { getPayPrice } from '@service/domainRegister/pay';
import { setWaitPayConfirm } from '../';

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

    const params = [domain, hexAccount, durationSeconds, commitInfo.secret, PublicResolver.hexAddress, [commitInfo.setAddrData], true, 0, commitInfo.wrapperExpiry];

    const txHash = await sendTransaction({
      data: Web3Controller.func.encodeFunctionData('register', params),
      from: account!,
      to: Web3Controller.address,
      value: payPrice.toHexMinUnit(),
    });

    setWaitPayConfirm(domain, true);
    setTimeout(() => setWaitPayConfirm(domain, false), 1000 * 180);
  } catch (err) {
    console.error('err', err);
  }
};
