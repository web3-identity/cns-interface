import { selectorFamily, useRecoilValue } from 'recoil';
import { fetchChain } from '@utils/fetchChain';
import { Web3Controller } from '@contracts/index';

export enum DomainStatus {
  Valid = 0,
  TooShort,
  Reserved,
  IllegalChar,
  Locked,
  Registered
}

const domainStatusQuery = selectorFamily({
  key: 'domainStatus',
  get: (domain: string) => async () => {
    const response = await fetchChain({
      params: [{ data: Web3Controller.func.encodeFunctionData('labelStatus', [domain]), to: Web3Controller.address }, 'latest_state'],
    });
    
    const NumRes = Number(response);
    if (!isNaN(NumRes)) return NumRes;
    throw 'Network error';
  },
});

export const useDomainStatus = (domain: string) => useRecoilValue(domainStatusQuery(domain));
