export * from './MinMaxCommitLockTime';
export * from './commitRegistration';
import { useEffect } from 'react';
import { atomFamily, selectorFamily, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { persistAtom, persistAtomWithDefault } from '@utils/recoilUtils';

export enum CommitStatus {
  UnderCommitLockTime = 0,
  ReadyForRegister,
  OverCommitLockTime,
}

const commitStatus = atomFamily<CommitStatus, string>({
  key: 'CommitStatus',
  effects: [persistAtomWithDefault(CommitStatus.UnderCommitLockTime)],
});

const commitTime = atomFamily<number, string>({
  key: 'commitTime',
  effects: [persistAtom],
});

const commitLockTime = selectorFamily<number, string>({
  key: 'commitLockTime',
  get: (domain: string) => ({ get }) => {
    // const commitTime = get(commitTime(domain));
    // return commitTime + 24 * 60 * 60 * 1000;
  }
})

export const recordCommitTime = (domain: string) => setRecoil(commitTime(domain), Date.now());
export const useCommitStatus = (domain: string) => useRecoilValue(commitStatus(domain));
export const useCheckCommitLockTime = (domain: string) => {};
