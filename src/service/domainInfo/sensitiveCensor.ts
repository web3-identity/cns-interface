import { selectorFamily, useRecoilValue, useRecoilCallback, useRecoilRefresher_UNSTABLE } from 'recoil';
import { fetchApi } from '@utils/fetch';
import payMethod from '@service/payMethod';

/**
 *
 * @param domain
 * @returns false when valid, detail string when illegal.
 */
export const fetchDomainSensitiveCensor = (domain: string) =>
  payMethod === 'web3'
    ? false
    : fetchApi<{ conclusion: '合规' | '合规'; data: Array<{ msg: string }> }>({ path: '/censor/text', method: 'POST', params: { content: domain } }).then((res) => {
        if (res?.conclusion === '合规') return false;
        return res?.data?.[0]?.msg || '不合规';
      });

const domainSensitiveCensorQuery = selectorFamily<string | false, string>({
  key: 'SensitiveCensorQuery',
  get: (domain: string) => async () => {
    try {
      return await fetchDomainSensitiveCensor(domain);
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainSensitiveCensor = (domain: string) => useRecoilValue(domainSensitiveCensorQuery(domain));
export const useRefreshDomainSensitiveCensor = (domain: string) => useRecoilRefresher_UNSTABLE(domainSensitiveCensorQuery(domain));
export const usePrefetchDomainSensitiveCensor = () =>
  useRecoilCallback(
    ({ snapshot }) =>
      (domain: string) =>
        snapshot.getPromise(domainSensitiveCensorQuery(domain))
  );
