import { atom, useRecoilValue } from 'recoil';
import { getRecoil } from 'recoil-nexus';

export const payMethodState = atom<'web2' | 'web3'>({
  key: 'payMethod',
  default: import.meta.env.MODE.startsWith('web2') ? 'web2' : 'web3',
});

export const usePayMethod = () => useRecoilValue(payMethodState);
export const getPayMethod = () => getRecoil(payMethodState);
