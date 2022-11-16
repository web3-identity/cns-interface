import { useEffect } from 'react';
import { atom, atomFamily, useRecoilValue } from 'recoil';
import { setRecoil } from 'recoil-nexus';
import { persistAtom, persistAtomWithDefault } from '@utils/recoilUtils';
import { useRefreshDomainStatus } from '@service/domainInfo';
import { fetchDomainOwner } from '@service/domainInfo';
import { usePayMethod } from '@service/payMethod';
import { getAccount } from '@service/account';
import LocalStorage from 'localstorage-enhance';
import waitAsyncResult, { getAsyncResult } from '@utils/waitAsyncResult';
import { clearCommitInfo, useCommitInfo } from './commit';
import { setWaitPayConfirm, getWaitPayConfirm, getOrderStatus, useRefreshMakeOrder } from './pay';
import { useRefreshDomainOwner } from '@service/domainInfo/owner';
import { useRefreshMyDomains } from '@service/myDomains';
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

export const setRegisterToStep = (domain: string, step: RegisterStep) => {
  setRecoil(registerStep(domain), step);
};

export const useRegisterStep = (domain: string) => useRecoilValue(registerStep(domain));

export const backToStep1 = (domain: string) => {
  clearCommitInfo(domain);
  setRegisterToStep(domain, RegisterStep.WaitCommit);
};

export const useMonitorDomainState = (domain: string, registerStep: RegisterStep) => {
  const refreshDomainStatus = useRefreshDomainStatus(domain);
  const refreshMakeOrder = useRefreshMakeOrder(domain);
  const refreshDomainOwner = useRefreshDomainOwner(domain);
  const refreshMyDomains = useRefreshMyDomains();

  useEffect(() => {
    let stop: VoidFunction;
    const startFetch = async () => {
      try {
        const [ownerPromise, _stop] = waitAsyncResult(() => fetchDomainOwner(domain), 0);
        stop = _stop;
        const owner = await ownerPromise;
        refreshDomainOwner();
        clearCommitInfo(domain);
        if (getAccount() === owner) {
          setRegisterToStep(domain, RegisterStep.Success);
          refreshMyDomains();
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
        const isWaitPayConfirm = getWaitPayConfirm(domain);
        if (preOrderStatus === orderStatus) {
          return ;
        }
        preOrderStatus = orderStatus;
        if (orderStatus === 'Paid') {
          if (!isWaitPayConfirm) {
            setWaitPayConfirm(domain, true);
          }
        } else {
          if (isWaitPayConfirm) {
            setWaitPayConfirm(domain, false);
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
            key?.startsWith?.('default|waitPayConfirm') ||
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
            setRegisterToStep(domain, RegisterStep.WaitCommit);
          }
          LocalStorage.removeItem(itemKey, namespace);
        });
    }

    if (account) {
      setPreAccount(account);
    }
  }, [account, preAccount]);
};
