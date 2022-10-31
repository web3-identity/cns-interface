import { selectorFamily, useRecoilValue } from 'recoil';
import dayjs from 'dayjs';
import { fetchChain } from '@utils/fetch';
import { BaseRegistrar } from '@contracts/index';
import { getDomainHash } from '@utils/domainHelper';

const domainExpireQuery = selectorFamily<{ timestamp: number, dateStr: string; }, string>({
  key: 'domainExpire',
  get: (domain: string) => async () => {
    try {
      const response = await fetchChain({
        params: [{ data: BaseRegistrar.func.encodeFunctionData('nameExpires', [getDomainHash(domain)]), to: BaseRegistrar.address }, 'latest_state'],
      });

      const timestamp = Number(response) * 1000;
      const dateStr = dayjs(timestamp).format('YYYY-MM-DD');
      return {
        timestamp,
        dateStr
      };
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainExpire = (domain: string) => useRecoilValue(domainExpireQuery(domain));
