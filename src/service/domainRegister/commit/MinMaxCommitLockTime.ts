import { atom, useRecoilValue } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { persistAtom } from '@utils/recoilUtils';
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
export const getMinCommitLockTime = () => getRecoil(minCommitLockTimeState) ?? 30;
export const getMaxCommitLockTime = () => getRecoil(maxCommitLockTimeState) ?? 600;


(() => {
  setTimeout(() => {
    fetchCommitmentLockTime('min').then((res) => setRecoil(minCommitLockTimeState, res));
    fetchCommitmentLockTime('max').then((res) => setRecoil(maxCommitLockTimeState, res));
  }, 1000);
})();