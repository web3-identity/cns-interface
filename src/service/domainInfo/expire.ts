import { atom, selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE, useRecoilCallback } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import LocalStorage from 'localstorage-enhance';
import { persistAtom, handleRecoilInit } from '@utils/recoilUtils';
import dayjs from 'dayjs';
import { fetchChain } from '@utils/fetch';
import { BaseRegistrar } from '@contracts/index';
import { getDomainHash } from '@utils/domainHelper';

interface DomainExpire {
  timestamp: number;
  dateFormat: string;
  dateFormatForSecond: string;
  date: {
    year: number;
    month: number;
    day: number;
    hour: number;
  };
  /** Unit day */
  gracePeriod: number;
  isExpired: boolean;
}

const fetchGracePeriod = async () => {
  try {
    const response: string = await fetchChain({
      params: [{ data: BaseRegistrar.func.encodeFunctionData('GRACE_PERIOD'), to: BaseRegistrar.address }, 'latest_state'],
    });
    const GRACE_PERIOD = BaseRegistrar.func.decodeFunctionResult('GRACE_PERIOD', response)?.[0]?.toString();
    return Number(GRACE_PERIOD) / 3600 / 24;
  } catch (err) {
    throw err;
  }
};

export const gracePeriodState = atom<number>({
  key: 'gracePeriod',
  effects: [persistAtom],
});

(() => {
  fetchGracePeriod().then((res) => {
    try {
      LocalStorage.setItem({ key: 'gracePeriod', data: res });
      handleRecoilInit((set) => set(gracePeriodState, res));
    } catch (_) {
      setRecoil(gracePeriodState, res);
    }
  });

})();

const domainExpireQuery = selectorFamily<DomainExpire, string>({
  key: 'domainExpire',
  get:
    (domain: string) =>
    async ({ get }) => {
      try {
        const response = await fetchChain({
          params: [{ data: BaseRegistrar.func.encodeFunctionData('nameExpires', [getDomainHash(domain)]), to: BaseRegistrar.address }, 'latest_state'],
        });
        
        const timestamp = Number(response) * 1000;
        const dateFormat = dayjs(timestamp).format('YYYY-MM-DD-HH');
        const date = Object.fromEntries(
          dateFormat
            .split(' ')[0]
            .split('-')
            .map((v, i) => [i === 0 ? 'year' : i === 1 ? 'month' : i === 2 ? 'day' : 'hour', Number(v)])
        );

        const GRACE_PERIOD = get(gracePeriodState);
        const gracePeriod = dayjs(timestamp).add(GRACE_PERIOD, 'day').diff(dayjs(), 'day');
        const isExpired = dayjs().isAfter(dayjs(timestamp));

        return {
          timestamp,
          dateFormatForSecond: dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'),
          date,
          gracePeriod,
          isExpired,
        } as DomainExpire;
      } catch (err) {
        throw err;
      }
    },
});

export const useDomainExpire = (domain: string) => useRecoilValue(domainExpireQuery(domain));
export const useRefreshDomainExpire = (domain: string) => useRecoilRefresher_UNSTABLE(domainExpireQuery(domain));
export const usePrefetchDomainExpire = () => useRecoilCallback(({ snapshot }) => (domain: string) => snapshot.getPromise(domainExpireQuery(domain)));
export const useGracePeriod = () => useRecoilValue(gracePeriodState);
export const getGracePeriod = () => getRecoil(gracePeriodState);
