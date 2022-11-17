import { selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE, useRecoilCallback } from 'recoil';
import { fetchChain } from '@utils/fetch';
import { NameWrapper } from '@contracts/index';
import { useHexAccount } from '@service/account';
import { dnsNameNotationDecode, getDomainLabel } from '@utils/domainHelper';

const myDomainsQuery = selectorFamily<Array<string>, string>({
  key: 'myDomains',
  get: (hexAccount: string) => async () => {
    try {
      return await fetchChain<string>({
        params: [{ data: NameWrapper.func.encodeFunctionData('userDomains', [hexAccount]), to: NameWrapper.address }, 'latest_state'],
      }).then((response) => {
        const myDomains = NameWrapper.func.decodeFunctionResult('userDomains', response)?.[0].map((domain: string) => getDomainLabel(dnsNameNotationDecode(domain)));
        return myDomains;
      });
    } catch (err) {
      throw err;
    }
  },
});

export const useMyDomains = () => {
  const hexAccount = useHexAccount()!;
  return useRecoilValue(myDomainsQuery(hexAccount));
};

export const useRefreshMyDomains = () => {
  const hexAccount = useHexAccount()!;
  return useRecoilRefresher_UNSTABLE(myDomainsQuery(hexAccount));
};

export const usePrefetchMyDomains = () => {
  const hexAccount = useHexAccount()!;
  return useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getLoadable(myDomainsQuery(hexAccount)),
    [hexAccount]
  );
};
