import { atomFamily, useRecoilValue } from 'recoil';
import { getRecoil, setRecoil } from 'recoil-nexus';
import { persistAtom, persistAtomWithDefault } from '@utils/recoilUtils';
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



const registerSecret = atomFamily<string | undefined, string>({
  key: 'registerSecret',
  effects: [persistAtom],
});

export const setRegisterSecret = (domain: string, secret?: string) => setRecoil(registerSecret(domain), secret);
export const getRegisterSecret = (domain: string) => getRecoil(registerSecret(domain));