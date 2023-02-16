import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import payMethod from '@service/payMethod';
import { randomSecret } from '@utils/domainHelper';
import { fetchChain } from '@utils/fetch';
import dayjs from 'dayjs';
import { yearsToSeconds } from '@utils/date';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { Web3Controller, PublicResolver } from '@contracts/index';
import { createSetAddrData } from '@service/domainRegistrar/setRegistrarAddress';
import { postCommitmentToBackend } from './web2Additional';
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
    const account = getAccount()!;
    const hexAccount = getHexAccount();
    const secret = randomSecret();
    const wrapperExpiry = dayjs().unix() + durationSeconds;
    const setAddrData = createSetAddrData({ domain, chain: 'Conflux Core', address: account });
    const commitParams = [domain, hexAccount, durationSeconds, secret, PublicResolver.hexAddress, [setAddrData], true, 0, wrapperExpiry];

    const commitmentHash: string = await fetchChain({
      params: [
        {
          data: Web3Controller.func.encodeFunctionData('makeCommitment(string,address,uint256,bytes32,address,bytes[],bool,uint16,uint64)', commitParams),
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

    if (payMethod === 'web2') {
      await postCommitmentToBackend(commitmentHash, commitParams);
    }

    setCommitInfo(domain, { commitmentHash, commitTime, secret, wrapperExpiry, durationYears, setAddrData });
  } catch (_) {
    console.error('commitRegistration error: ', _);
  }
};
