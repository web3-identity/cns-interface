export * from './MinMaxCommitLockTime';
export * from './commitRegistration';
import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtomWithNamespace } from '@utils/recoilUtils';
import { getMinCommitLockTime, getMaxCommitLockTime } from './MinMaxCommitLockTime';
import JobSchedule from '@utils/JobSchedule';
import { setRigisterToStep, RegisterStep } from '..';

export type CommitInfo = {
  validTime: {
    start: number;
    end: number;
  };
  secret: string;
  durationYears: number;
};

(() => {
  try {
    const _storageData = localStorage.getItem('localStorage_enhance');
    if (!_storageData) return;
    const storageData = JSON.parse(_storageData);
    if (!Array.isArray(storageData)) return;
    const allCommitInfo = storageData.filter((data: [string, any]) => data?.[0]?.startsWith('CommitInfo'));
    console.log(allCommitInfo);
  } catch(err) {
    console.log('Init CommitInfo schudle', err);
  }
})();
export const commitInfoState = atomFamily<CommitInfo | null, string>({
  key: 'CommitInfo',
  effects: [persistAtomWithNamespace('CommitInfo')],
});

export const setCommitInfo = (domain: string, commitInfo: { commitTime: number; secret: string; durationYears: number }) => {
  const minCommitLockTime = getMinCommitLockTime();
  const maxCommitLockTime = getMaxCommitLockTime();
  if (!commitInfo || !minCommitLockTime || !maxCommitLockTime) {
    setRecoil(commitInfoState(domain), null);
    return null;
  }

  const validTime = {
    start: commitInfo.commitTime + minCommitLockTime * 1000,
    end: commitInfo.commitTime + maxCommitLockTime * 1000,
  };

  setRecoil(commitInfoState(domain), {
    validTime,
    secret: commitInfo.secret,
    durationYears: commitInfo.durationYears,
  });

  JobSchedule.addJob({
    triggerTime: [validTime.start, validTime.end],
    callback: [() => {
      setRigisterToStep(domain, RegisterStep.WaitPay);
    }, () => {
      setRigisterToStep(domain, RegisterStep.WaitCommit)
      setRecoil(commitInfoState(domain), null);
    }]
  });
};


export const useCommitInfo = (domain: string) => useRecoilValue(commitInfoState(domain));
export const getCommitInfo = (domain: string) => getRecoil(commitInfoState(domain))!;
