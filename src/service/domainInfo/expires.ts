// import { selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
// import { fetchChain } from '@utils/fetch';
// import { Web3Controller } from '@contracts/index';

// export enum DomainStatus {
//   Valid = 0,
//   TooShort,
//   Reserved,
//   IllegalChar,
//   Locked,
//   Registered,
// }

// const domainStatusQuery = selectorFamily<DomainStatus, string>({
//   key: 'domainStatus',
//   get: (domain: string) => async () => {
//     try {
//       const response = await fetchChain({
//         params: [{ data: Web3Controller.func.encodeFunctionData('labelStatus', [domain]), to: Web3Controller.address }, 'latest_state'],
//       });
//       return Number(response);
//     } catch (err) {
//       throw err;
//     }
//   },
// });

// export const useDomainStatus = (domain: string) => useRecoilValue(domainStatusQuery(domain));
// export const useRefreshDomainStatus = (domain: string) => useRecoilRefresher_UNSTABLE(domainStatusQuery(domain));
