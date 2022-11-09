import { atom } from 'recoil';
import { store as fluentStore, switchChain as _switchChain } from '@cfxjs/use-wallet-react/conflux/Fluent';
import { targetChainId } from '..';
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

export const disconnect =  () => Promise<void>

export const switchChain = () => _switchChain('0x' + Number(targetChainId).toString(16));
