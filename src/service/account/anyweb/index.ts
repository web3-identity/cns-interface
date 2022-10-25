import { atom } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtom } from '@utils/recoilUtils';
import { Provider } from '@idealight-labs/anyweb-js-sdk';
import { sendTransaction as send } from '@cfxjs/use-wallet-react/conflux/Fluent';

export const provider = new Provider({
  logger: null as unknown as undefined,
  appId: '527572b7-40ac-49bf-b689-5dd94b4dff41',
});

export const accountState = atom<string | null | undefined>({
  key: 'anywebAccountState',
  default: null,
  effects: [
    persistAtom,
    ({ setSelf }) => {
      provider.on('ready', () => {
        provider
          .request({
            method: 'anyweb_loginstate',
            params: [],
          })
          .then((isLogined) => {
            if (!isLogined) {
              setSelf(null);
            } else {
              provider
                .request({
                  method: 'cfx_accounts',
                  params: [
                    {
                      availableNetwork: [1, 1029],
                      scopes: ['baseInfo', 'identity'],
                    },
                  ],
                })
                .then((result) => {
                  const account = result as Account;
                  const { address } = account;
                  setSelf(address?.[0]);
                });
            }
          });
      });
    },
  ],
});

interface Account {
  address: string | null | undefined;
}

export const connect = async () => {
  provider
    .request({
      method: 'cfx_accounts',
      params: [
        {
          availableNetwork: [1, 1029],
          scopes: ['baseInfo', 'identity'],
        },
      ],
    })
    .then((result) => {
      const account = result as Account;
      const { address } = account;
      setRecoil(accountState, address);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const sendTransaction = (params: Parameters<typeof send>[0]) =>
  provider.request({
    method: 'cfx_sendTransaction',
    params: [
      {
        ...params,
        from: getRecoil(accountState),
      },
    ],
  });
