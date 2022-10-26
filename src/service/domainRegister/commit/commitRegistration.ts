import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { getPayMethod } from '@service/payMethod';
import { randomSecret, getDomainHash } from '@utils/domainHelper';
import { fetchChain } from '@utils/fetch';
import isMobile from '@utils/isMobie';
import { yearsToSeconds } from '@utils/date';
import { Web3Controller, PublicResolver } from '@contracts/index';
import { postCommitmentToBackend } from './web2Additional/pc';
import { setCommitmentHash } from '.';
import { setRegisterSecret } from '../';

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
    const commitParams = [domain, hexAccount, durationSeconds, secret, PublicResolver.hexAddress, [], true, 0, 1659467455 + durationSeconds];

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

    await sendTransaction({
      data: Web3Controller.func.encodeFunctionData(payMethod === 'web3' ? 'commit' : 'commitWithName', [
        commitmentHash,
        ...(payMethod === 'web3' ? [] : [getDomainHash(domain)]),
      ]),
      from: account!,
      to: Web3Controller.address,
    });

    if (payMethod === 'web2' && !isMobile()) {
      await postCommitmentToBackend(commitmentHash, commitParams);
    }
    setCommitmentHash(domain, commitmentHash);
    setRegisterSecret(domain, secret);
  } catch (err) {
    console.error('err', err);
  }
};
