import { atom, useRecoilValue } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
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
export const getMinCommitLockTime = () => getRecoil(minCommitLockTimeState) ?? 10;
export const getMaxCommitLockTime = () => getRecoil(maxCommitLockTimeState) ?? 600;

(() => {
  fetchCommitmentLockTime('min').then((res) => {
    try {
      handleRecoilInit((set) => set(minCommitLockTimeState, res));
    } catch (_) {
      setRecoil(minCommitLockTimeState, res)
    }
  });
  fetchCommitmentLockTime('max').then((res) => {
    try {
      handleRecoilInit((set) => set(maxCommitLockTimeState, res));
    } catch (_) {
      setRecoil(maxCommitLockTimeState, res)
    }
  });
})();
