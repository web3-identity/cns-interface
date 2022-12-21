import { selectorFamily, useRecoilValue, useRecoilCallback, useRecoilRefresher_UNSTABLE } from 'recoil';
import { fetchApi } from '@utils/fetch';
import { waitSeconds } from '@utils/waitAsyncResult';
import payMethod from '@service/payMethod';
import LocalStorage from 'localstorage-enhance';

/**
 *
 * @param domain
 * @returns false when valid, detail string when illegal.
 */
const fetchDomainSensitiveCensor = (domain: string): false | string | Promise<string | false> =>
  fetchApi<{ detail: string; conclusion: '合规' | '合规'; data: Array<{ msg: string }> }>({ path: 'censor/text', method: 'POST', params: { content: domain } }).then(
    async (res) => {
      if (!!res?.detail) {
        if (String(res?.detail).includes('Open api qps request limit reached')) {
          await waitSeconds(1);
          return await fetchDomainSensitiveCensor(domain);
        } else {
          throw new Error(res.detail);
        }
      } else {
        let result: string | false;
        if (res?.conclusion === '合规') {
          result = false;
        } else {
          result = res?.data?.[0]?.msg || '不合规';
        }
        LocalStorage.setItem({ key: `SensitiveCensor-${domain}`, data: result });
        return result;
      }
    }
  );

const domainSensitiveCensorQuery = selectorFamily<string | false, string>({
  key: 'SensitiveCensorQuery',
  get: (domain: string) => async () => {
    try {
      if (payMethod === 'web3') return false;
      const cachedRes = LocalStorage.getItem(`SensitiveCensor-${domain}`) as string | false | null;
      if (cachedRes !== null) {
        // setTimeout(() => fetchDomainSensitiveCensor(domain));
        return cachedRes;
      }

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
