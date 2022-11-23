import { atom, selector, useRecoilValue } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtom } from '@utils/recoilUtils';
import { convertCfxToHex, validateCfxAddress } from '@utils/addressUtils';
import {
  accountState as fluentAccountState,
  chainIdState as fluentChainIdState,
  connect as connectFluent,
  disconnect as disconnectFluent,
  switchChain as switchChainFluent,
  sendTransaction as sendTransactionWithFluent,
} from './fluent';
import {
  accountState as anywebAccountState,
  connect as connectAnyweb,
  disconnect as disconnectAnyweb,
  switchChain as switchChainAnyweb,
  sendTransaction as sendTransactionWithAnyweb,
} from './anyweb';
import isProduction from '@utils/isProduction';
export const targetChainId = isProduction ? '1029' : '1';

const methodsMap = {
  fluent: {
    accountState: fluentAccountState,
    chainIdState: fluentChainIdState,
    connect: connectFluent,
    switchChain: switchChainFluent,
    sendTransaction: sendTransactionWithFluent,
    disconnect: disconnectFluent,
  },
  anyweb: {
    accountState: anywebAccountState,
    connect: connectAnyweb,
    switchChain: switchChainAnyweb,
    sendTransaction: sendTransactionWithAnyweb,
    disconnect: disconnectAnyweb,
  },
} as const;

type Methods = keyof typeof methodsMap;

export const accountMethodFilter = atom<Methods | null>({
  key: 'accountFilter',
  default: null,
  effects: [persistAtom],
});

export const accountState = selector({
  key: 'account',
  get: ({ get }) => {
    const filter = get(accountMethodFilter);
    if (!filter) return null;

    const { accountState } = methodsMap[filter];
    return get(accountState);
  },
});

export const hexAccountState = selector({
  key: 'hexAccount',
  get: ({ get }) => {
    const cfxAccount = get(accountState);
    if (!cfxAccount || !validateCfxAddress(cfxAccount)) return null;
    return convertCfxToHex(cfxAccount);
  },
});

export const chainIdState = selector({
  key: 'chainIdState',
  get: ({ get }) => {
    const filter = get(accountMethodFilter);
    if (filter === 'fluent') {
      return get(fluentChainIdState);
    }

    const account = get(accountState);
    if (!account) return null;
    if (account.startsWith('cfxtest')) return '1';
    return '1029';
  },
});

export const getAccountMethod = () => getRecoil(accountMethodFilter);
export const getAccount = () => getRecoil(accountState);
export const getHexAccount = () => getRecoil(hexAccountState);

export const connect = async (method: Methods) => {
  try {
    await methodsMap[method].connect();
    setRecoil(accountMethodFilter, method);
  } catch (_) {}
};

export const disconnect = async (method: Methods) => {
  try {
    await methodsMap[method].disconnect();
    setRecoil(accountMethodFilter, null);
  } catch (_) {}
};

export const switchChain = () => {
  const method = getAccountMethod();
  if (!method) return;
  methodsMap[method].switchChain();
};

export const sendTransaction = async (params: Parameters<typeof sendTransactionWithFluent>[0] & { from: string }) => {
  const accountMethod = getAccountMethod();
  if (!accountMethod) {
    throw new Error('No account connected');
  }
  return methodsMap[accountMethod].sendTransaction(params) as unknown as string;
};

export const useAccount = () => useRecoilValue(accountState);
export const useAccountMethod = () => useRecoilValue(accountMethodFilter);
export const useHexAccount = () => useRecoilValue(hexAccountState);
export const useChainId = () => useRecoilValue(chainIdState);
