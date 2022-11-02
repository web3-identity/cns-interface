import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { getPayMethod } from '@service/payMethod';
import { randomSecret } from '@utils/domainHelper';
import { fetchChain } from '@utils/fetch';
import dayjs from 'dayjs';
import isMobile from '@utils/isMobie';
import { yearsToSeconds } from '@utils/date';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { Web3Controller, PublicResolver } from '@contracts/index';
import { postCommitmentToBackend } from './web2Additional/pc';
import { setCommitInfo } from '../';

const isCommitReceipt = (commitmentHash: string) =>
  fetchChain<string>({
    params: [{ data: Web3Controller.func.encodeFunctionData('commitments', [commitmentHash]), to: Web3Controller.address }, 'latest_state'],
  }).then((timestamp) => (timestamp ? Number(timestamp) * 1000 : null));

interface Params {
  domain: string;
  durationYears: number;
}

export const commitRegistration = async ({ domain, durationYears }: Params) => {
  try {
    const durationSeconds = yearsToSeconds(durationYears);
    const account = getAccount();
    const hexAccount = getHexAccount();
    const payMethod = getPayMethod();
    const secret = randomSecret();
    const now = dayjs().unix()
    const commitParams = [domain, hexAccount, durationSeconds, secret, PublicResolver.hexAddress, [], true, 0, now + durationSeconds];

    const commitmentHash: string = await fetchChain({
      params: [
        {
          data: Web3Controller.func.encodeFunctionData('makeCommitment', commitParams),
          from: account,
          to: Web3Controller.address,
        },
        'latest_state',
      ],
    });

    const txHash = await sendTransaction({
      data: Web3Controller.func.encodeFunctionData('commit', [commitmentHash]),
      from: account!,
      to: Web3Controller.address,
    });

    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;

    const [receiptCommit] = waitAsyncResult(() => isCommitReceipt(commitmentHash));
    const commitTime = await receiptCommit;

    if (payMethod === 'web2' && !isMobile()) {
      const _ = await postCommitmentToBackend(commitmentHash, commitParams);
    }

    setCommitInfo(domain, { commitmentHash, commitTime, secret, durationYears });
  } catch (err) {
    console.error('err', err);
  }
};
