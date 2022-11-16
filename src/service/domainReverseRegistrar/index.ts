import { selector, useRecoilValue, useRecoilRefresher_UNSTABLE, useRecoilCallback } from 'recoil';
import { fetchChain } from '@utils/fetch';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { hexAccountState, accountState, getAccount, sendTransaction } from '@service/account';
import { ReverseRegistrar, PublicResolver } from '@contracts/index';
import { hideAllModal } from '@components/showPopup';

export const setDomainReverseRegistrar = async ({ domain, refreshDomainReverseRegistrar }: { domain: string; refreshDomainReverseRegistrar: VoidFunction }) => {
  try {
    const account = getAccount();
    const txHash = await sendTransaction({
      data: ReverseRegistrar.func.encodeFunctionData('setName', [domain]),
      from: account!,
      to: ReverseRegistrar.address,
    });

    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    refreshDomainReverseRegistrar?.();
    hideAllModal();
  } catch (err) {
    console.error('err', err);
  }
};

const domainReverseRegistrarQuery = selector({
  key: 'domainReverseRegistrar',
  get: async ({ get }) => {
    const account = get(accountState);
    const hexAccount = get(hexAccountState);
    try {
      const node = await fetchChain<string>({
        params: [{ data: ReverseRegistrar.func.encodeFunctionData('node', [hexAccount]), to: ReverseRegistrar.address }, 'latest_state'],
      });

      const domain = await fetchChain<string>({
        params: [{ data: PublicResolver.func.encodeFunctionData('name', [node]), to: PublicResolver.address }, 'latest_state'],
      }).then((response) => {
        const domain = PublicResolver.func.decodeFunctionResult('name', response)?.[0];
        return domain;
      });

      return domain;
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainReverseRegistrar = () => useRecoilValue(domainReverseRegistrarQuery);
export const useRefreshDomainReverseRegistrar = () => useRecoilRefresher_UNSTABLE(domainReverseRegistrarQuery);
export const usePrefetchDomainReverseRegistrar = () =>
  useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getLoadable(domainReverseRegistrarQuery)
  );
