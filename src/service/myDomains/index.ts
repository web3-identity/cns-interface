import { selectorFamily, useRecoilValue } from 'recoil';
import { fetchChain } from '@utils/fetch';
import { NameWrapper } from '@contracts/index';

export const fetchMyDomains = (account: string) =>
  fetchChain<string>({
    params: [{ data: NameWrapper.func.encodeFunctionData('userDomains', [account]), to: NameWrapper.address }, 'latest_state'],
  }).then((response) => {
    console.log('myDomains', response);
    return response;
  });


const myDomainsQuery = selectorFamily({
  key: 'myDomains',
  get: (account: string) => async () => {
    try {
      return await fetchMyDomains(account);
    } catch (err) {
      throw err;
    }
  },
});


export const useMyDomains = (account: string) => useRecoilValue(myDomainsQuery(account));
