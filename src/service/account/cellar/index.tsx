import { Cellar, CellarEnv } from 'cellar-js-sdk';
import { atom } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtom } from '@utils/recoilUtils';
import isProduction from '@utils/isProduction';
import { sendTransaction as send } from '@cfxjs/use-wallet-react/conflux/Fluent';

globalThis.process = {};
globalThis.process.env = 'development';

const cellar = new Cellar({
  appId: '84a131626ec245939f3d83e6ea01cb08',
  env: isProduction ? CellarEnv.PRO : CellarEnv.PRE,
});

export const accountState = atom<string | null | undefined>({
  key: 'cellarAccountState',
  default: null,
  effects: [
    persistAtom,
    ({ setSelf }) => {
      cellar
        .request({
          method: 'cellar_loginState',
        })
        .then((res: Account) => {
          const account = res?.data?.userWallet;
          setSelf(account);
        })
        .catch(() => {
          setSelf(null);
        });
    },
  ],
});

interface Account {
  code: number;
  data: {
    authorityCode: string;
    userCode: string;
    userWallet: string;
  };
}

export const connect = async () =>
  cellar
    .request({
      method: 'cfx_accounts',
    })
    .then((res: Account) => {
      const account = res?.data?.userWallet;
      setRecoil(accountState, account);
    });

export const disconnect = async () =>
  cellar.request({
    method: 'cellar_loginOut',
  });

export const sendTransaction = (params: Parameters<typeof send>[0]) =>
  cellar
    .request({
      method: 'cfx_sendTransaction',
      params,
    })
    .then((res: any) => (typeof res === 'string' ? res : res?.data));

export const switchChain = () => {
  // targetChainId
};
