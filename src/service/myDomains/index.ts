import { selector, useRecoilValue } from 'recoil';
import { fetchChain } from '@utils/fetch';
import { NameWrapper } from '@contracts/index';
import { hexAccountState } from '@service/account';
import { dnsNameNotationDecode } from '@utils/domainHelper';

const myDomainsQuery = selector({
  key: 'myDomains',
  get: async ({ get }) => {
    try {
      const hexAccount = get(hexAccountState);
      return await fetchChain<string>({
        params: [{ data: NameWrapper.func.encodeFunctionData('userDomains', [hexAccount]), to: NameWrapper.address }, 'latest_state'],
      }).then((response) => {
        const myDomains = NameWrapper.func.decodeFunctionResult('userDomains', response)?.[0].map((domain: string) => dnsNameNotationDecode(domain));
        return myDomains;
      });
    } catch (err) {
      throw err;
    }
  },
});

export const useMyDomains = () => useRecoilValue(myDomainsQuery);
