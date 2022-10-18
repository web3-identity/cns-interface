import { atom } from 'recoil';
import {Provider} from '@idealight-labs/anyweb-js-sdk';
import { setRecoil } from 'recoil-nexus';

export const provider = new Provider({
  logger: console,
  appId: '527572b7-40ac-49bf-b689-5dd94b4dff41',
})

export const accountState = atom<string | null | undefined>({
    key: 'anywebAccountState',
    default: null
});

interface Account {
  address: string | null | undefined,
}

export const connect = async () => {
  provider.request({
    method: 'cfx_accounts',
    params: [{
      availableNetwork: [1, 1029],
      scopes: ['baseInfo', 'identity'],
    }]
  }).then((result) => {
    const account = result as Account;
    const {address} = account;
    setRecoil(accountState, address);
  }).catch((e) => {
    console.error(e)
  })
}