import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { clamp } from 'lodash-es';
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

export const setRigisterToNextStep = (domain: string) => {
  setRecoil(registerStep(domain), (pre: number) => clamp(pre + 1, RegisterStep.WaitCommit, RegisterStep.Success));
};

export const useRegisterStep = (domain: string) => useRecoilValue(registerStep(domain));
