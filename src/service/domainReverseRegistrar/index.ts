import { useMemo } from 'react';
import { selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE, useRecoilCallback } from 'recoil';
import { getRecoil } from 'recoil-nexus';
import { fetchChain } from '@utils/fetch';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { getAccount, sendTransaction, useHexAccount, getHexAccount } from '@service/account';
import { ReverseRegistrar, PublicResolver, ReverseRecords } from '@contracts/index';
import { recordToHidePopup } from '@components/showPopup';

export const setDomainReverseRegistrar = async ({ domain, refreshDomainReverseRegistrar }: { domain: string; refreshDomainReverseRegistrar: VoidFunction }) => {
  try {
    const hidePopup = recordToHidePopup();
    const account = getAccount();
    const txHash = await sendTransaction({
      data: ReverseRegistrar.func.encodeFunctionData('setName', [!!domain ? (domain.endsWith?.('.web3') ? domain : `${domain}.web3`) : '']),
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
      const res = await fetchChain<string>({
        params: [{ data: ReverseRecords.func.encodeFunctionData('getNames', [[hexAccount]]), to: ReverseRecords.address }, 'latest_state'],
      }).then((response) => {
        return ReverseRecords.func.decodeFunctionResult('getNames', response)?.[0]?.[0];
      });
      return res;
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainReverseRegistrar = () => {
  const hexAccount = useHexAccount()!;
  const domainReverseRegistrar = useRecoilValue(domainReverseRegistrarQuery(hexAccount));

  return useMemo(() => (!domainReverseRegistrar?.endsWith('.web3') ? domainReverseRegistrar : domainReverseRegistrar?.split?.('.')?.[0]), [domainReverseRegistrar]);
};

export const getDomainReverseRegistrar = async () => {
  const hexAccount = getHexAccount()!;
  const domainReverseRegistrar = await getRecoil(domainReverseRegistrarQuery(hexAccount));
  return !domainReverseRegistrar?.endsWith('.web3') ? domainReverseRegistrar : domainReverseRegistrar?.split?.('.')?.[0];
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
