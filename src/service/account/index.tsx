import { atom, selector, useRecoilValue } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtom } from '@utils/recoilUtils';
import { convertCfxToHex, convertHexToCfx, validateCfxAddress, validateHexAddress } from '@utils/addressUtils';
import { accountState as fluentAccountState, connect as connectFluent, sendTransaction as sendTransactionWithFluent } from './fluent';
import { accountState as anywebAccountState, connect as connectAnyweb, sendTransaction as sendTransactionWithAnyweb} from './anyweb';

const methodsMap = {
  fluent: {
    accountState: fluentAccountState,
    connect: connectFluent,
    sendTransaction: sendTransactionWithFluent
  },
  anyweb: {
    accountState: anywebAccountState,
    connect: connectAnyweb,
    sendTransaction: sendTransactionWithAnyweb
  },
} as const;

type Methods = keyof typeof methodsMap;

const accountMethodFilter = atom<Methods | null>({
  key: 'accountFilter',
  default: null,
  effects: [persistAtom],
});

const account = selector({
  key: 'account',
  get: ({ get }) => {
    const filter = get(accountMethodFilter);
    if (!filter) return null;
    const { accountState } = methodsMap[filter];
    const account = get(accountState);
    if (!account) return account;
    if (validateHexAddress(account)) {
      return convertHexToCfx(account, import.meta.env.MODE === 'production' ? '1029' : '1');
    }
    return account;
  },
});

const hexAccount = selector({
  key: 'hexAccount',
  get: ({ get }) => {
    const cfxAccount = get(account);
    if (!cfxAccount || !validateCfxAddress(cfxAccount)) return null;
    return convertCfxToHex(cfxAccount);
  },
});


export const getAccountMethod = () => getRecoil(accountMethodFilter);
export const getAccount = () => getRecoil(account);
export const getHexAccount = () => getRecoil(hexAccount);

export const connect = async (method: Methods) => {
  try {
    await methodsMap[method].connect();
    setRecoil(accountMethodFilter, method);
  } catch (_) {}
};

export const sendTransaction = async (params: Parameters<typeof sendTransactionWithFluent>[0] & { from: string; }) => {
  const accountMethod = getAccountMethod();
  if (!accountMethod) {
    throw new Error('No account connected');
  }
  return methodsMap[accountMethod].sendTransaction(params)
};


export const disconnect = () => setRecoil(accountMethodFilter, null);
export const useAccount = () => useRecoilValue(account);
