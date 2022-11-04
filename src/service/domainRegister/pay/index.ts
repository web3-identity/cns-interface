export * from './price';
export * from './web3';
export * from './web2/pc';
import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtomWithDefault } from '@utils/recoilUtils';

const waitPayConfirmState = atomFamily<boolean, string>({
  key: 'waitPayConfirm',
  effects: [persistAtomWithDefault(false)]
});

export const setWaitPayConfirm = (domain: string, state: boolean) => setRecoil(waitPayConfirmState(domain), state);
export const getWaitPayConfirm = (domain: string) => getRecoil(waitPayConfirmState(domain));

export const useWaitPayConfirmState = (domain: string) => useRecoilValue(waitPayConfirmState(domain));
