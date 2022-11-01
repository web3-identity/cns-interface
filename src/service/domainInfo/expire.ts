import { selectorFamily, useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import { fetchChain } from '@utils/fetch';
import { BaseRegistrar } from '@contracts/index';
import { getDomainHash } from '@utils/domainHelper';

interface DomainExpire {
  timestamp: number;
  dateFormat: string;
  date: {
    year: number;
    month: number;
    day: number;
  };
  /** Unit day */
  gracePeriod: number;
}

const domainExpireQuery = selectorFamily<DomainExpire, string>({
  key: 'domainExpire',
  get: (domain: string) => async () => {
    try {
      const response = await fetchChain({
        params: [{ data: BaseRegistrar.func.encodeFunctionData('nameExpires', [getDomainHash(domain)]), to: BaseRegistrar.address }, 'latest_state'],
      });

      const timestamp = Number(response) * 1000;
      const dateFormat = dayjs(timestamp).format('YYYY-MM-DD');
      const date = Object.fromEntries(dateFormat.split('-').map((v, i) => [i === 0 ? 'year' : i === 1 ? 'month' : 'day', Number(v)]));
      const gracePeriod = dayjs(timestamp).add(90, 'day').diff(dayjs(), 'day');
      
      return {
        timestamp,
        dateFormat,
        date,
        gracePeriod,
      } as DomainExpire;
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainExpire = (domain: string) => useRecoilValue(domainExpireQuery(domain));
