import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { persistAtomWithDefault } from '@utils/recoilUtils';
export * from './commit';

export enum RegisterStep {
  WaitCommit = 0,
  WaitPay,
  Success,
}

const registerStep = atomFamily({
  key: 'RegisterStep',
  effects: [persistAtomWithDefault(RegisterStep.WaitCommit)],
});

export const setRigisterToStep = (domain: string, step: RegisterStep) => {
  setRecoil(registerStep(domain), step);
};

export const useRegisterStep = (domain: string) => useRecoilValue(registerStep(domain));
