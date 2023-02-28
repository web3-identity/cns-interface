import { atom, useRecoilValue } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import LocalStorage from 'localstorage-enhance';
import { persistAtom, handleRecoilInit } from '@utils/recoilUtils';
import { fetchChain } from '@utils/fetch';
import { Web3Controller } from '@contracts/index';

const fetchCommitmentLockTime = async (type: 'min' | 'max') => {
  try {
    const response = await fetchChain({
      params: [{ data: Web3Controller.func.encodeFunctionData(`${type}CommitmentAge`), to: Web3Controller.address }, 'latest_state'],
    });
    return Number(response);
  } catch (err) {
    throw err;
  }
};

// unit second
export const minCommitLockTimeState = atom<number>({
  key: 'minCommitmentLockTime',
  effects: [persistAtom],
});

export const maxCommitLockTimeState = atom<number>({
  key: 'maxCommitmentLockTime',
  effects: [persistAtom],
});

export const useMinCommitLockTime = () => useRecoilValue(minCommitLockTimeState);
export const useMaxCommitLockTime = () => useRecoilValue(maxCommitLockTimeState);
export const getMinCommitLockTime = () => getRecoil(minCommitLockTimeState) ?? (10 + 5);
export const getMaxCommitLockTime = () => getRecoil(maxCommitLockTimeState) ?? 600;

(() => {
  fetchCommitmentLockTime('min').then((res) => {
    // It seems that pay's minimum time is a little larger than this number
    const minTime = res + 5;
    
    try {
      LocalStorage.setItem({ key: 'minCommitmentLockTime', data: minTime });
      handleRecoilInit((set) => set(minCommitLockTimeState, minTime));
    } catch (_) {
      setRecoil(minCommitLockTimeState, minTime)
    }
  });
  fetchCommitmentLockTime('max').then((res) => {
    try {
      LocalStorage.setItem({ key: 'maxCommitmentLockTime', data: res });
      handleRecoilInit((set) => set(maxCommitLockTimeState, res));
    } catch (_) {
      setRecoil(maxCommitLockTimeState, res)
    }
  });
})();
