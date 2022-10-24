import { atom } from 'recoil';
import { store as fluentStore } from '@cfxjs/use-wallet-react/conflux/Fluent';
export { connect, sendTransaction } from '@cfxjs/use-wallet-react/conflux/Fluent';

export const accountState = atom<string | null | undefined>({
  key: 'fluentAccountState',
  default: undefined,
  effects: [
    ({ setSelf, trigger }) => {
      if (trigger === 'get') {
        setSelf(fluentStore.getState().accounts?.[0]);
      }

      const unsubFluentAccount = fluentStore.subscribe(
        (state) => state.accounts,
        (accounts) => setSelf(accounts?.[0])
      );
      return unsubFluentAccount;
    },
  ],
});
