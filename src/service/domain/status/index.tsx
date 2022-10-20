import { selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import { fetchChain } from '@utils/fetchChain';
import { Web3Controller } from '@contracts/index';

export enum DomainStatus {
  Valid = 0,
  TooShort,
  Reserved,
  IllegalChar,
  Locked,
  Registered,
}

let i = 0;
const domainStatusQuery = selectorFamily({
  key: 'domainStatus',
  get: (domain: string) => async () => {
    try {
      const response = await fetchChain({
        params: [{ data: Web3Controller.func.encodeFunctionData('labelStatus', [domain]), to: Web3Controller.address }, 'latest_state'],
      });
      if (++i % 2 === 0) throw 'Network error';
      const NumRes = Number(response);
      if (!isNaN(NumRes)) return NumRes as DomainStatus;
      throw new Error('Response unvalid: ' + response);
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainStatus = (domain: string) => useRecoilValue(domainStatusQuery(domain));
export const useRefreshDomainStatus = (domain: string) => useRecoilRefresher_UNSTABLE(domainStatusQuery(domain));
