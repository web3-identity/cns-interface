import { selectorFamily, useRecoilValue } from 'recoil';
import { accountState } from '@service/account';


const myDomainsQuery = selectorFamily({
  key: 'myDomains',
  get: () => ({ get }) => {
    const account = get(accountState);
    if (!account) return [];
    return [];
  },
});


export const useMyDomains = (domain: string) => useRecoilValue(myDomainsQuery(domain));
