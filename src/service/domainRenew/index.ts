export * from './web3';
export * from './web2';
import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';

export enum RenewStep {
  InputDurationYears,
  WaitRenewPay,
  WaitConfirm,
  Success,
}

const renewStepState = atomFamily<RenewStep, string>({
  key: 'RenewStep',
  default: RenewStep.InputDurationYears
});

export const setRenewStep = (domain: string, step: RenewStep) => setRecoil(renewStepState(domain), step);
export const getRenewStep = (domain: string) => getRecoil(renewStepState(domain));
export const resetRenewStep = (domain: string) => setRecoil(renewStepState(domain), RenewStep.InputDurationYears);
export const useRenewStep = (domain: string) => useRecoilValue(renewStepState(domain));
