export * from './MinMaxCommitLockTime';
export * from './commitRegistration';
import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import JobSchedule from '@utils/JobSchedule';
import { persistAtomWithNamespace } from '@utils/recoilUtils';
import { getMinCommitLockTime, getMaxCommitLockTime } from './MinMaxCommitLockTime';
import { setRigisterToStep, RegisterStep, setWaitPayConfrim } from '..';

export type CommitInfo = {
  commitmentHash: string;
  validTime: {
    start: number;
    end: number;
  };
  secret: string;
  durationYears: number;
};

export const commitInfoState = atomFamily<CommitInfo | null, string>({
  key: 'CommitInfo',
  effects: [persistAtomWithNamespace('CommitInfo')],
});

export const setCommitInfo = (domain: string, commitInfo: { commitmentHash: string; commitTime: number; secret: string; durationYears: number }) => {
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
    commitmentHash: commitInfo.commitmentHash,
    validTime,
    secret: commitInfo.secret,
    durationYears: commitInfo.durationYears,
  });

  scheduleJob(domain, validTime);
};

export const clearCommitInfo = (domain: string) => {
  setRecoil(commitInfoState(domain), null);
  JobSchedule.removeJob(domain);
  setWaitPayConfrim(domain, false);
};

const scheduleJob = (domain: string, validTime: CommitInfo['validTime']) => {
  JobSchedule.addJob({
    key: domain,
    triggerTime: [validTime.start, validTime.end],
    callback: [
      () => {
        setRigisterToStep(domain, RegisterStep.WaitPay);
      },
      () => {
        setRigisterToStep(domain, RegisterStep.WaitCommit);
        clearCommitInfo(domain);
      },
    ],
  });
};

export const useCommitInfo = (domain: string) => useRecoilValue(commitInfoState(domain));
export const getCommitInfo = (domain: string) => getRecoil(commitInfoState(domain))!;

(() => {
  try {
    const _storageData = localStorage.getItem('localStorage_enhance');
    if (!_storageData) return;
    let storageData = JSON.parse(_storageData);
    if (!Array.isArray(storageData)) return;
    const allCommitInfo = storageData.filter((data: [string, any]) => data?.[0]?.startsWith('CommitInfo'));
    allCommitInfo.forEach((data: [string, any]) => {
      const regex = /\"(.+?)\"/g;
      const domain = regex.exec(data?.[0])?.[1];
      const commitInfo = data?.[1]?.data;
      if (!commitInfo || !domain) return;
      scheduleJob(domain, commitInfo.validTime);
    });
  } catch (err) {
    console.error('Init CommitInfo schudle error', err);
  }
})();
