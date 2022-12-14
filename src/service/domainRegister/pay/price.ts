import { selectorFamily, useRecoilValue_TRANSITION_SUPPORT_UNSTABLE, useRecoilRefresher_UNSTABLE } from 'recoil';
import { getRecoil } from 'recoil-nexus';
import { Unit } from '@cfxjs/use-wallet-react/conflux/Fluent';
import { fetchChain } from '@utils/fetch';
import { Web3Controller } from '@contracts/index';
import { yearsToSeconds } from '@utils/date';
import payMethod from '@service/payMethod';
import { commitInfoState } from '@service/domainRegister/commit';
import { registerDurationYearsState } from '@pages/DomainRegister/Register/Step1';

const payPrice = selectorFamily<Unit, string>({
  key: 'payPrice',
  get:
    (domain: string) =>
    async ({ get }) => {
      const registerDurationYears = get(registerDurationYearsState(domain));
      const commitInfo = get(commitInfoState(domain));
      const durationYears = commitInfo?.durationYears ?? registerDurationYears ?? 1;

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
export const useRefreshPayPrice = (domain: string) => useRecoilRefresher_UNSTABLE(payPrice(domain));
