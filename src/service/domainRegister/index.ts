import { useEffect } from 'react';
import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { persistAtomWithDefault } from '@utils/recoilUtils';
import { fetchDomainOwner } from '@service/domainInfo';
import waitAsyncResult from '@utils/waitAsyncResult';
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
  useEffect(() => {
    let stop: VoidFunction;
    const startFetch = async () => {
      const [ownerPromise, _stop] = waitAsyncResult(() => fetchDomainOwner(domain))
      stop = _stop
      const owner = await ownerPromise;
    }

    startFetch();

    return () => { stop?.(); };
  }, [domain]);

  useEffect(() => {

  }, []);
}