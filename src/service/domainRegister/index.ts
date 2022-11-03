import { useEffect, useLayoutEffect } from 'react';
import { atom, atomFamily, useRecoilValue } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtom, persistAtomWithDefault } from '@utils/recoilUtils';
import { useRefreshDomainStatus } from '@service/domainInfo';
import { fetchDomainOwner } from '@service/domainInfo';
import { usePayMethod } from '@service/payMethod';
import { getAccount } from '@service/account';
import LocalStorage from 'localstorage-enhance';
import waitAsyncResult, { getAsyncResult } from '@utils/waitAsyncResult';
import { clearCommitInfo, useCommitInfo } from './commit';
import { setWaitPayConfrim, getWaitPayConfrim, getOrderStatus, useRefreshMakeOrder } from './pay';
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
};

export const useMonitorDomainState = (domain: string, registerStep: RegisterStep) => {
  const refreshDomainStatus = useRefreshDomainStatus(domain);
  const refreshMakeOrder = useRefreshMakeOrder(domain);

  useEffect(() => {
    let stop: VoidFunction;
    const startFetch = async () => {
      try {
        const [ownerPromise, _stop] = waitAsyncResult(() => fetchDomainOwner(domain), 0);
        stop = _stop;
        const owner = await ownerPromise;
        clearCommitInfo(domain);
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
    if (payMethod === 'web3' || !commitInfo?.commitmentHash || registerStep !== RegisterStep.WaitPay || !domain) return;

    let preOrderStatus: string | null = null;
    const stop = getAsyncResult(
      () => getOrderStatus(commitInfo.commitmentHash),
      (orderStatus: string) => {
        const isWaitPayConfrim = getWaitPayConfrim(domain);
        if (preOrderStatus === orderStatus) {
          return ;
        }
        preOrderStatus = orderStatus;
        if (orderStatus === 'Paid') {
          if (!isWaitPayConfrim) {
            setWaitPayConfrim(domain, true);
          }
        } else {
          if (isWaitPayConfrim) {
            setWaitPayConfrim(domain, false);
          }
          refreshMakeOrder();
        }
      },
      0
    );

    return () => {
      stop?.();
    };
  }, [domain, payMethod, registerStep, commitInfo?.commitmentHash]);
};

const preAccount = atom<string>({
  key: 'preAccountState',
  effects: [persistAtom],
});
export const setPreAccount = (account: string) => setRecoil(preAccount, account);
export const usePreAccount = () => useRecoilValue(preAccount);

export const useClearRegisterInfoWhenAccountChange = (account: string | null | undefined) => {
  const preAccount = usePreAccount();

  useEffect(() => {
    if (account && preAccount && account !== preAccount) {
      const _storageData = localStorage.getItem('localStorage_enhance');
      if (!_storageData) return;
      const storageData = JSON.parse(_storageData);
      if (!Array.isArray(storageData)) return;
      storageData
        .filter(
          ([key]: [string, any]) =>
            key?.startsWith?.('default|waitPayConfrim') ||
            key?.startsWith?.('CommitInfo|CommitInfo') ||
            key?.startsWith?.('default|RegisterStep') ||
            key?.startsWith?.('default|registerDurationYears')
        )
        .forEach(([key]: [string, any]) => {
          const [namespace, itemKey] = key.split('|');
          const regex = /\"(.+?)\"/g;
          const domain = regex.exec(itemKey)?.[1];
          if (domain) {
            clearCommitInfo(domain);
            setRigisterToStep(domain, RegisterStep.WaitCommit);
          }
          LocalStorage.removeItem(itemKey, namespace);
        });
    }

    if (account) {
      setPreAccount(account);
    }
  }, [account, preAccount]);
};
