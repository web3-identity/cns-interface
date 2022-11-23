import { useMemo } from 'react';
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
      data: ReverseRegistrar.func.encodeFunctionData('setName', [!domain.endsWith?.('.web3') ? domain : domain.split('.')[0]]),
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

      return await fetchChain<string>({
        params: [{ data: PublicResolver.func.encodeFunctionData('name', [node]), to: PublicResolver.address }, 'latest_state'],
      }).then((response) => PublicResolver.func.decodeFunctionResult('name', response)?.[0]);
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainReverseRegistrar = () => {
  const hexAccount = useHexAccount()!;
  const domainReverseRegistrar = useRecoilValue(domainReverseRegistrarQuery(hexAccount));

  return useMemo(() => !domainReverseRegistrar?.endsWith('.web3') ? domainReverseRegistrar : domainReverseRegistrar?.split?.('.')?.[0], [domainReverseRegistrar]);
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
