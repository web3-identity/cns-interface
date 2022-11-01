import { useEffect } from 'react';
import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { persistAtomWithDefault } from '@utils/recoilUtils';
import { useRefreshDomainStatus } from '@service/domainInfo';
import { fetchDomainOwner } from '@service/domainInfo';
import { getAccount } from '@service/account';
import waitAsyncResult from '@utils/waitAsyncResult';
import { clearCommitInfo } from './commit';
import { setWaitPayConfrim } from './pay';
export * from './commit';
export * from './pay';

export enum RegisterStep {
  WaitCommit = 0,
  WaitPay,
  Success,
}

const registerStep = atomFamily<RegisterStep, string>({
  key: 'RegisterStep',
  effects: [persistAtomWithDefault(RegisterStep.WaitCommit)],
});

export const setRigisterToStep = (domain: string, step: RegisterStep) => {
  setRecoil(registerStep(domain), step);
};

export const useRegisterStep = (domain: string) => useRecoilValue(registerStep(domain));

export const useMonitorDomainState = (domain: string) => {
  const refreshDomainStatus = useRefreshDomainStatus(domain);

  useEffect(() => {
    let stop: VoidFunction;
    const startFetch = async () => {
      try {
        const [ownerPromise, _stop] = waitAsyncResult(() => fetchDomainOwner(domain));
        stop = _stop;
        const owner = await ownerPromise;
        clearCommitInfo(domain);
        setWaitPayConfrim(domain, false);
        if (getAccount() === owner) {
          setRigisterToStep(domain, RegisterStep.Success);
        } else {
          refreshDomainStatus();
        }
      } catch (_) {}
    };

    startFetch();
    return () => {
      stop?.();
    };
  }, [domain]);

  useEffect(() => {
    const timer = setInterval(() => refreshDomainStatus, 10000);
    return () => clearInterval(timer);
  }, []);
};
