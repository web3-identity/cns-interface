import { getAccount, getHexAccount, getAccountMethod, sendTransaction } from '@service/account';
import { randomSecret, getDomainHash } from '@utils/domainHelper';
import { fetchChain } from '@utils/fetchChain';
import { Web3Controller, PublicResolver } from '@contracts/index';
import { setCommitmentHash } from './';
import {postCommitment} from '@utils/api'
import {generateCommitmentParams} from '@utils/api/helper'

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
    const secret = randomSecret();
    const commitParams = [domain, hexAccount, durationSeconds, secret, PublicResolver.hexAddress, [], true, 0, 1659467455 + durationSeconds];
    const commitment: string = await fetchChain({
      params: [
        {
          data: Web3Controller.func.encodeFunctionData('makeCommitment', commitParams),
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
    await postCommitment(generateCommitmentParams(commitment,commitParams))
    setCommitmentHash(domain, commitment);
  } catch (err) {
    console.info('err', err);
  }
};
