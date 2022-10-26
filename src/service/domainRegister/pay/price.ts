import { selectorFamily, useRecoilValue_TRANSITION_SUPPORT_UNSTABLE } from 'recoil';
import { getRecoil } from 'recoil-nexus';
import { Unit } from '@cfxjs/use-wallet-react/conflux/Fluent';
import { fetchChain } from '@utils/fetch';
import { Web3Controller } from '@contracts/index';
import { payMethodState } from '@service/payMethod';
import { yearsToSeconds } from '@utils/date';
import { registerDurationYears } from '../commit';

const payPrice = selectorFamily<Unit, string>({
  key: 'payPrice',
  get:
    (domain: string) =>
    async ({ get }) => {
      const payMethod = get(payMethodState);
      const durationYears = get(registerDurationYears(domain));

      try {
        const encodeData: string = await fetchChain({
          params: [
            {
              data: Web3Controller.func.encodeFunctionData(payMethod === 'web3' ? 'rentPrice' : 'rentPriceInFiat', [domain, yearsToSeconds(durationYears)]),
              to: Web3Controller.address,
            },
            'latest_state',
          ],
        });

        const [[{ _hex: price }]] = Web3Controller.func.decodeFunctionResult(payMethod === 'web3' ? 'rentPrice' : 'rentPriceInFiat', encodeData);
        return Unit.fromMinUnit(price);
      } catch (err) {
        throw err;
      }
    },
});

export const getPayPrice = (domain: string) => getRecoil(payPrice(domain));
export const usePayPrice = (domain: string) => useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(payPrice(domain));
