import { useMemo } from 'react';
import { selectorFamily, useRecoilValue_TRANSITION_SUPPORT_UNSTABLE, useRecoilRefresher_UNSTABLE, useRecoilCallback } from 'recoil';
import { getRecoil } from 'recoil-nexus';
import { fetchChain } from '@utils/fetch';
import waitAsyncResult, { isTransactionReceipt } from '@utils/waitAsyncResult';
import { getAccount, sendTransaction, useHexAccount, getHexAccount } from '@service/account';
import { ReverseRegistrar, ReverseRecords } from '@contracts/index';
export * from './handleAccountReverseRegistrar';

export const setAccountReverseRegistrar = async (domain: string) => {
  const account = getAccount();
  const txHash = await sendTransaction({
    data: ReverseRegistrar.func.encodeFunctionData('setName', [!!domain ? (domain.endsWith?.('.web3') ? domain : `${domain}.web3`) : '']),
    from: account!,
    to: ReverseRegistrar.address,
  });

  const [receiptPromise] = waitAsyncResult(() => isTransactionReceipt(txHash));
  await receiptPromise;
};

const accountReverseRegistrarQuery = selectorFamily<string | null, string>({
  key: 'accountReverseRegistrar',
  get: (hexAccount: string) => async () => {
    if (!hexAccount) return null;
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

export const useAccountReverseRegistrar = () => {
  const hexAccount = useHexAccount()!;
  const accountReverseRegistrar = useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(accountReverseRegistrarQuery(hexAccount));

  return useMemo(() => (!accountReverseRegistrar?.endsWith('.web3') ? accountReverseRegistrar : accountReverseRegistrar?.split?.('.')?.[0]), [accountReverseRegistrar]);
};

export const getAccountReverseRegistrar = async () => {
  const hexAccount = getHexAccount()!;
  const accountReverseRegistrar = await getRecoil(accountReverseRegistrarQuery(hexAccount));
  return !accountReverseRegistrar?.endsWith('.web3') ? accountReverseRegistrar : accountReverseRegistrar?.split?.('.')?.[0];
};

export const useRefreshAccountReverseRegistrar = () => {
  const hexAccount = useHexAccount()!;
  return useRecoilRefresher_UNSTABLE(accountReverseRegistrarQuery(hexAccount));
};

export const usePrefetchAccountReverseRegistrar = () => {
  const hexAccount = useHexAccount()!;
  return useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getPromise(accountReverseRegistrarQuery(hexAccount)),
    [hexAccount]
  );
};
