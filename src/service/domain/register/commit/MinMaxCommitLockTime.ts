import { atom, useRecoilValue } from 'recoil';
import { getRecoil } from 'recoil-nexus';
import { persistAsynAtom } from '@utils/recoilUtils';
import { fetchChain } from '@utils/fetchChain';
import { Web3Controller } from '@contracts/index';

const fetchCommitmentLockTime = (type: 'min' | 'max') => async () => {
  try {
    const response = await fetchChain({
      params: [{ data: Web3Controller.func.encodeFunctionData(`${type}CommitmentAge`), to: Web3Controller.address }, 'latest_state'],
    });
    const NumRes = Number(response);
    if (!isNaN(NumRes)) return NumRes;
    throw new Error(`${type}CommitmentAge Response unvalid: ` + response);
  } catch (err) {
    throw err;
  }
};

// unit second
export const minCommitLockTimeState = atom<number>({
  key: 'minCommitmentLockTime',
  effects: [persistAsynAtom(fetchCommitmentLockTime('min'))],
});

export const maxCommitLockTimeState = atom<number>({
  key: 'maxCommitmentLockTime',
  effects: [persistAsynAtom(fetchCommitmentLockTime('max'))],
});

export const useMinCommitLockTime = () => useRecoilValue(minCommitLockTimeState);
export const useMaxCommitLockTime = () => useRecoilValue(maxCommitLockTimeState);
export const getMinCommitLockTime = () => getRecoil(minCommitLockTimeState);
export const getMaxCommitLockTime = () => getRecoil(maxCommitLockTimeState);
