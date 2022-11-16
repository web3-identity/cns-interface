import { selectorFamily, useRecoilValue, useRecoilCallback, useRecoilValueLoadable, useRecoilRefresher_UNSTABLE } from 'recoil';
import { fetchChain } from '@utils/fetch';
import { getNameHash } from '@utils/domainHelper';
import { convertHexToCfx } from '@utils/addressUtils/convertAddress';
import { NameWrapper } from '@contracts/index';
import { useAccount } from '@service/account';
import isProduction from '@utils/isProduction';

const zeroAddress = '0x0000000000000000000000000000000000000000';
export const fetchDomainOwner = (domain: string) =>
  fetchChain<string>({
    params: [{ data: NameWrapper.func.encodeFunctionData('ownerOf', [getNameHash(domain + '.web3')]), to: NameWrapper.address }, 'latest_state'],
  }).then((response) => {
    const [address] = NameWrapper.func.decodeFunctionResult('ownerOf', response);
    if (address === zeroAddress) return null;
    return convertHexToCfx(address, isProduction ? '1029' : '1');
  });

const domainOwnerQuery = selectorFamily<string | null, string>({
  key: 'domainOwnerQuery',
  get: (domain: string) => async () => {
    try {
      return await fetchDomainOwner(domain);
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainOwner = (domain: string) => useRecoilValue(domainOwnerQuery(domain));
export const useRefreshDomainOwner = (domain: string) => useRecoilRefresher_UNSTABLE(domainOwnerQuery(domain));
export const usePrefetchDomainOwner = () => useRecoilCallback(({ snapshot }) => (domain: string) => snapshot.getLoadable(domainOwnerQuery(domain)));

export const useIsOwner = (domain: string) => {
  const account = useAccount();
  const { state, contents } = useRecoilValueLoadable(domainOwnerQuery(domain));

  if (state === 'hasValue' && contents) return account === contents;
  return null;
};
