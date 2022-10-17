import { selectorFamily, useRecoilValue } from 'recoil';
import { fetchChain } from '@utils/fetchChain';
import { Web3Controller } from '@contracts/index';

const domainStatusQuery = selectorFamily({
  key: 'domainStatus',
  get: (domain) => async () => {
    const response = await fetchChain({
      params: [{ data: Web3Controller.func.encodeFunctionData('labelStatus', ['qweaxc']), to: Web3Controller.address }, 'latest_state'],
    });
    
    const NumRes = Number(response);
    if (!isNaN(NumRes)) return NumRes;
    throw 'Network error';
  },
});

export const useDomainStatus = (domain: string) => useRecoilValue(domainStatusQuery(domain));
