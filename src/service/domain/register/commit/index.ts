export * from './MinMaxCommitLockTime';
export * from './commitRegistration';
import { atomFamily, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import LocalStorage from 'localstorage-enhance';
import { persistAtom } from '@utils/recoilUtils';
import { intervalFetchChain } from '@utils/fetchChain';
import { Web3Controller } from '@contracts/index';
import { getMinCommitLockTime, getMaxCommitLockTime } from './MinMaxCommitLockTime';
import { useRegisterStep, setRigisterToStep, RegisterStep } from '../';

const commitmentHash = atomFamily<string | undefined, string>({
  key: 'commitmentHash',
  effects: [
    persistAtom,
    ({ onSet, trigger, node: { key } }) => {
      let cancel: VoidFunction | null = null;
      const clearCancel = () => {
        if (cancel) {
          cancel();
          cancel = null;
        }
      };

      const waitCommitmentTimeConfirm = (commitmentHash?: string) => {
        clearCancel();
        if (!commitmentHash) return;
        cancel = intervalFetchChain(
          {
            params: [{ data: Web3Controller.func.encodeFunctionData('commitments', [commitmentHash]), to: Web3Controller.address }, 'latest_state'],
          },
          {
            intervalTime: 1000,
            callback: (_res) => {
              const res = Number(_res);
              if (res) {
                clearCancel();
                const regex = /\"(.+?)\"/g;
                const domain = regex.exec(key)?.[1];
                if (domain) {
                  setCommitLockTime(domain, res * 1000);
                }
              }
            },
          }
        );
      };

      if (trigger === 'get') {
        const localCommitmentHash = LocalStorage.getItem(key) as string;
        waitCommitmentTimeConfirm(localCommitmentHash);
      }
      onSet(waitCommitmentTimeConfirm);

      return clearCancel;
    },
  ],
});

export const setCommitmentHash = (domain: string, hash?: string) => setRecoil(commitmentHash(domain), hash);

export type CommitLockTime = {
  start: number;
  end: number;
} | null;

const commitLockTime = atomFamily<CommitLockTime, string>({
  key: 'commitLockTime',
  effects: [
    ({ onSet, node: { key } }) => {
      const regex = /\"(.+?)\"/g;
      const domain = regex.exec(key)?.[1];

      let timer: ReturnType<typeof setInterval> | null = null;
      const clearTimer = () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      };

      onSet((lockTime) => {
        clearTimer();
        if (!domain) return;
        if (!lockTime) {
          setRigisterToStep(domain, RegisterStep.WaitCommit);
          return;
        }

        const { start, end } = lockTime;
        timer = setInterval(() => {
          const now = Date.now();
          if (now >= start && now <= end) {
            setRigisterToStep(domain, RegisterStep.WaitPay);
          } else if (now > end) {
            setCommitmentHash(domain, undefined);
            setRigisterToStep(domain, RegisterStep.WaitCommit);
            clearTimer();
          }
        }, 250);
      });

      return clearTimer;
    },
  ],
});

const setCommitLockTime = (domain: string, commitTime: number) => {
  const minCommitLockTime = getMinCommitLockTime();
  const maxCommitLockTime = getMaxCommitLockTime();
  if (!commitTime || !minCommitLockTime || !maxCommitLockTime) return null;
  const lockTime = {
    start: commitTime + minCommitLockTime * 1000,
    end: commitTime + maxCommitLockTime * 1000,
  };
  setRecoil(commitLockTime(domain), lockTime);
};

export const useCommitInfo = (domain: string) => {
  const registerStep = useRegisterStep(domain);
  const hashLoadable = useRecoilValueLoadable(commitmentHash(domain));
  const lockLoadable = useRecoilValueLoadable(commitLockTime(domain));

  return {
    isWaitCommitConfirm: registerStep === RegisterStep.WaitCommit && !!hashLoadable.contents && !!lockLoadable.contents,
    registerStep,
    commitLockTime: lockLoadable.contents as CommitLockTime,
  } as const;
};
