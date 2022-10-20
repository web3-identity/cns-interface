import { atom, selector, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { localStorageEffect } from '@utils/recoilUtils';
import { accountState as fluentAccountState, connect as connectFluent } from './fluent';
import { accountState as anywebAccountState, connect as connectAnyweb } from './anyweb';

const methodsMap = {
  fluent: {
    accountState: fluentAccountState,
    connect: connectFluent,
  },
  anyweb: {
    accountState: anywebAccountState,
    connect: connectAnyweb,
  },
} as const;

type Methods = keyof typeof methodsMap;

const accountMethodFilter = atom<Methods | null>({
  key: 'accountFilter',
  default: null,
  effects_UNSTABLE: [localStorageEffect('accountFilter')],
});

export const accountState = selector({
  key: 'accountState',
  get: ({ get }) => {
    const filter = get(accountMethodFilter);
    if (!filter) return null;
    const { accountState } = methodsMap[filter];
    return get(accountState);
  },
});

export const connect = async (method: Methods) => {
  try {
    await methodsMap[method].connect();
    setRecoil(accountMethodFilter, method);
  } catch (_) {}
};

export const disconnect = () => setRecoil(accountMethodFilter, null);
export const useAccount = () => useRecoilValue(accountState);
