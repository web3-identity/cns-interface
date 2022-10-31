import { selector, useRecoilValue } from 'recoil';
import { fetchChain } from '@utils/fetch';
import { NameWrapper } from '@contracts/index';
import { hexAccountState } from '@service/account';

export const fetchMyDomains = (account: string) =>
  fetchChain<string>({
    params: [{ data: NameWrapper.func.encodeFunctionData('userDomains', [account]), to: NameWrapper.address }, 'latest_state'],
  }).then((response) => {
    const myDomains = NameWrapper.func.decodeFunctionResult('userDomains', response)?.[0];
    console.log('myDomains', myDomains);
    return myDomains;
  });

const myDomainsQuery = selector({
  key: 'myDomains',
  get: async ({ get }) => {
    const hexAccount = get(hexAccountState);
    try {
      return await fetchMyDomains(hexAccount!);
    } catch (err) {
      throw err;
    }
  },
});

export const useMyDomains = () => useRecoilValue(myDomainsQuery);
