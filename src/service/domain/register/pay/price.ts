import { selectorFamily, useRecoilValue_TRANSITION_SUPPORT_UNSTABLE } from 'recoil';
import { Unit } from '@cfxjs/use-wallet-react/conflux/Fluent';
import { fetchChain } from '@utils/fetchChain';
import { Web3Controller } from '@contracts/index';
import { accountMethodFilter } from '@service/account';
import { registerDurationYears } from '../commit';

const payPrice = selectorFamily<Unit, string>({
  key: 'payPrice',
  get:
    (domain: string) =>
    async ({ get }) => {
      const method = get(accountMethodFilter);
      const durationYears = get(registerDurationYears(domain));

      try {
        const encodeData: string = await fetchChain({
          params: [
            {
              data: Web3Controller.func.encodeFunctionData(!method || method === 'fluent' ? 'rentPrice' : 'rentPriceInFiat', [domain, 31536000 * durationYears]),
              to: Web3Controller.address,
            },
            'latest_state',
          ],
        });
        const [[{ _hex: price }]] = Web3Controller.func.decodeFunctionResult('rentPrice', encodeData);
        return Unit.fromMinUnit(price);
      } catch (err) {
        throw err;
      }
    },
});

export const usePayPrice = (domain: string) => useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(payPrice(domain));
