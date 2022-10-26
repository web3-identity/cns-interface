import { getAccount, getHexAccount, sendTransaction } from '@service/account';
import { yearsToSeconds } from '@utils/date';
import { Web3Controller, PublicResolver } from '@contracts/index';
import { getPayPrice } from '../';
import { getRegisterSecret } from '../../';

interface Params {
  domain: string;
  durationYears: number;
}

export const web3Pay = async ({ domain, durationYears }: Params) => {
  try {
    const durationSeconds = yearsToSeconds(durationYears);
    const account = getAccount();
    const hexAccount = getHexAccount();
    const secret = getRegisterSecret(domain);
    const payPrice = getPayPrice(domain);

    const params = [domain, hexAccount, durationSeconds, secret, PublicResolver.hexAddress, [], true, 0, 1659467455 + durationSeconds];
    
    await sendTransaction({
      data: Web3Controller.func.encodeFunctionData('register', params),
      from: account!,
      to: Web3Controller.address,
      value: payPrice.toHexMinUnit()
    });

  } catch (err) {
    console.error('err', err);
  }
};
