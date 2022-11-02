import { useEffect } from 'react';
import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtomWithDefault } from '@utils/recoilUtils';
import { useRefreshDomainStatus } from '@service/domainInfo';
import { fetchDomainOwner } from '@service/domainInfo';
import { usePayMethod } from '@service/payMethod';
import { getAccount } from '@service/account';
import waitAsyncResult from '@utils/waitAsyncResult';
import { clearCommitInfo, useCommitInfo } from './commit';
import { setWaitPayConfrim, isOrderPaid } from './pay';
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

const getRigisterToStep = (domain: string) => getRecoil(registerStep(domain));
export const setRigisterToStep = (domain: string, step: RegisterStep) => {
  setRecoil(registerStep(domain), step);
};

export const useRegisterStep = (domain: string) => useRecoilValue(registerStep(domain));


export const backToStep1 = (domain: string) => {
  clearCommitInfo(domain);
  setRigisterToStep(domain, RegisterStep.WaitCommit);
  setWaitPayConfrim(domain, false);
}

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

  const payMethod = usePayMethod();
  const commitInfo = useCommitInfo(domain);
  useEffect(() => {
    if (payMethod === 'web3' || !commitInfo) return;

    let stop: VoidFunction;
    const startFetch = async () => {
      try {
        const [orderPaidPromise, _stop] = waitAsyncResult(() => isOrderPaid(commitInfo.commitmentHash));
        stop = _stop;
        const _ = await orderPaidPromise;
        if (getRigisterToStep(domain) === RegisterStep.WaitPay) {
          setWaitPayConfrim(domain, true);
        }
      } catch (_) {}
    };

    startFetch();
    return () => {
      stop?.();
    };
  }, [payMethod, commitInfo]);

  useEffect(() => {
    const timer = setInterval(() => refreshDomainStatus, 10000);
    return () => clearInterval(timer);
  }, []);
};
