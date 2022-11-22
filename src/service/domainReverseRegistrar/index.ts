import { selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE, useRecoilCallback } from 'recoil';
import { fetchChain } from '@utils/fetch';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { getAccount, sendTransaction, useHexAccount } from '@service/account';
import { ReverseRegistrar, PublicResolver } from '@contracts/index';
import { recordToHidePopup } from '@components/showPopup';

export const setDomainReverseRegistrar = async ({ domain, refreshDomainReverseRegistrar }: { domain: string; refreshDomainReverseRegistrar: VoidFunction }) => {
  try {
    const hidePopup = recordToHidePopup();
    const account = getAccount();
    const txHash = await sendTransaction({
      data: ReverseRegistrar.func.encodeFunctionData('setName', [domain]),
      from: account!,
      to: ReverseRegistrar.address,
    });

    const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
    await receiptPromise;
    refreshDomainReverseRegistrar?.();
    hidePopup();
  } catch (err) {
    console.error('err', err);
  }
};

const domainReverseRegistrarQuery = selectorFamily<string | null, string>({
  key: 'domainReverseRegistrar',
  get: (hexAccount: string) => async () => {
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

export const useDomainReverseRegistrar = () => {
  const hexAccount = useHexAccount()!;
  return useRecoilValue(domainReverseRegistrarQuery(hexAccount));
};

export const useRefreshDomainReverseRegistrar = () => {
  const hexAccount = useHexAccount()!;
  return useRecoilRefresher_UNSTABLE(domainReverseRegistrarQuery(hexAccount));
};

export const usePrefetchDomainReverseRegistrar = () => {
  const hexAccount = useHexAccount()!;
  return useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getPromise(domainReverseRegistrarQuery(hexAccount)),
    [hexAccount]
  );
};
