import { selector, useRecoilValue } from 'recoil';
import { fetchChain } from '@utils/fetch';
import { getAccount, sendTransaction } from '@service/account';
import { ReverseRegistrar, PublicResolver } from '@contracts/index';
import { hexAccountState } from '@service/account';

interface Params {
  domain: string;
}

export const domainReverseRegistrar = async ({ domain }: Params) => {
  try {
    const account = getAccount();
    const txHash = await sendTransaction({
      data: ReverseRegistrar.func.encodeFunctionData('setName', [domain]),
      from: account!,
      to: ReverseRegistrar.address,
    });
    return txHash;
  } catch (err) {
    console.error('err', err);
  }
};

const domainReverseRegistrarQuery = selector({
  key: 'domainReverseRegistrar',
  get: async ({ get }) => {
    const hexAccount = get(hexAccountState);
    try {
      const node = await fetchChain<string>({
        params: [{ data: ReverseRegistrar.func.encodeFunctionData('node', [hexAccount]), to: ReverseRegistrar.address }, 'latest_state'],
      }).then((response) => {
        return response;
      });
      return await fetchChain<string>({
        params: [{ data: PublicResolver.func.encodeFunctionData('name', [node]), to: PublicResolver.address }, 'latest_state'],
      }).then((response) => {
        const domain = PublicResolver.func.decodeFunctionResult('name', response)?.[0];
        console.log('domain', domain)
        return domain;
      });
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainReverseRegistrar = () => useRecoilValue(domainReverseRegistrarQuery);
