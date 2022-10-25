import { getAccount, getHexAccount, getAccountMethod, sendTransaction } from '@service/account';
import { randomSecret, getDomainHash } from '@utils/domainHelper';
import { fetchChain } from '@utils/fetchChain';
import { Web3Controller, PublicResolver } from '@contracts/index';
import { recordCommitTime } from './';

interface Params {
  domain: string;
  durationYears: number;
}

export const commitRegistration = async ({ domain, durationYears }: Params) => {
  try {
    const durationSeconds = durationYears * 365 * 24 * 60 * 60;
    const account = getAccount();
    const hexAccount = getHexAccount();
    const accountMethod = getAccountMethod();

    const commitment = await fetchChain({
      params: [
        {
          data: Web3Controller.func.encodeFunctionData('makeCommitment', [
            domain,
            hexAccount,
            durationSeconds,
            randomSecret(),
            PublicResolver.hexAddress,
            [],
            true,
            0,
            1659467455 + durationSeconds,
          ]),
          from: account,
          to: Web3Controller.address,
        },
        'latest_state',
      ],
    });

    await sendTransaction({
      data: Web3Controller.func.encodeFunctionData(accountMethod === 'fluent' ? 'commit' : 'commitWithName', [
        commitment,
        ...(accountMethod === 'fluent' ? [] : [getDomainHash(domain)]),
      ]),
      from: account!,
      to: Web3Controller.address,
    });

    if (accountMethod === 'fluent') {
      recordCommitTime(domain);
    }
  } catch (err) {
    console.info('err', err);
  }
};
