import { useEffect } from 'react';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE, atomFamily } from 'recoil';
import dayjs from 'dayjs';
import { uniqueId } from 'lodash-es';
import { fetchApi } from '@utils/fetch';
import { getAsyncResult } from '@utils/waitAsyncResult';
import { yearsToSeconds } from '@utils/date';
import { registerDurationYearsState } from '@pages/DomainRegister/Register/Step1';
import { useRefreshDomainExpire } from '@service/domainInfo';
import isMobile from '@utils/isMobie';
import { getRenewStep, setRenewStep, RenewStep } from '../index';

const renewOrder = (domain: string, durationYears: number) => {
  const durationSeconds = yearsToSeconds(durationYears);
  const wrapperExpiry = dayjs().unix() + durationSeconds;

  return fetchApi({
    path: `renews/order`,
    method: 'POST',
    params: {
      // trade_provider: 'wechat',
      // trade_type: 'native',
      trade_provider: 'alipay',
      trade_type: isMobile ? 'wap' : 'h5',
      fuses: 0,
      wrapper_expiry: wrapperExpiry,
      cns_name: domain,
      description: domain,
      duration: durationSeconds,
    },
  });
};

export const getRenewOrderStatus = (id: number) =>
  fetchApi<Response>({ path: `renews/order/${id}`, method: 'GET' }).then((res) => {
    if (!!res?.tx_state && res.tx_state !== 'INIT') {
      return res?.tx_state;
    }
    return !!res?.trade_state && res.trade_state === 'SUCCESS' ? 'Paid' : null;
  });

interface Response {
  id: number;
  // wechat pay
  code_url?: string;
  // alipay pc
  h5_url?: string;
  // alipay mobile
  wap_url?: string;
  commit_hash: string;
  trade_state: string;
  refund_state: string;
  tx_state: string;
  trade_provider: 'alipay' | 'wechat';
}

const renewOrderId = atomFamily<number | string, string>({
  key: 'renewOrderId',
  default: uniqueId('renew'),
});
export const useRenewOrderId = (domain: string) => useRecoilValue(renewOrderId(domain));
export const resetRenewOrderId = (domain: string) => setRecoil(renewOrderId(domain), uniqueId('renew'));
export const useRecordOrderId = (domain: string) =>
  useEffect(() => {
    return () => setRecoil(renewOrderId(domain), getRecoil(makeRenewOrderQuery(domain))?.id ?? uniqueId('renew'));
  }, []);

const makeRenewOrderQuery = selectorFamily<Response, string>({
  key: 'makeRenewOrder',
  get:
    (domain) =>
    async ({ get }) => {
      const renewDurationYears = get(registerDurationYearsState(domain));
      get(renewOrderId(domain));

      try {
        const postRes: any = await renewOrder(domain, renewDurationYears);
        if (!!postRes?.code) {
          throw new Error(postRes.message);
        }

        if (!!postRes?.tx_state && postRes.tx_state !== 'INIT') {
          throw new Error(postRes?.tx_state);
        }
        return postRes;
      } catch (err) {
        throw err;
      }
    },
});

export const useMakeRenewOrder = (domain: string) => useRecoilValue(makeRenewOrderQuery(domain));
export const useRefreshMakeRenewOrder = (domain: string) => useRecoilRefresher_UNSTABLE(makeRenewOrderQuery(domain));

export const useMonitorWeb2PcRenewPayStatus = ({ domain, id }: { domain: string; id?: number | string }) => {
  const refreshDomainExpire = useRefreshDomainExpire(domain);
  const refreshMakeRenewOrder = useRefreshMakeRenewOrder(domain);

  useEffect(() => {
    if (typeof id !== 'number' || !domain) return;

    let preOrderStatus: string | null = null;
    const stop = getAsyncResult(
      () => getRenewOrderStatus(id),
      async (orderStatus: string) => {
        const isWaitPayConfirm = getRenewStep(domain) === RenewStep.WaitConfirm;
        if (preOrderStatus === orderStatus) {
          return;
        }
        preOrderStatus = orderStatus;
        if (orderStatus === 'Paid') {
          if (!isWaitPayConfirm) {
            setRenewStep(domain, RenewStep.WaitConfirm);
          }
        } else {
          if (orderStatus === 'EXECUTED_SUCCESS') {
            setRenewStep(domain, RenewStep.Success);
            refreshDomainExpire();
          } else {
            if (isWaitPayConfirm) {
              setRenewStep(domain, RenewStep.WaitRenewPay);
            }
            refreshMakeRenewOrder();
          }
        }
      },
      0
    );

    return () => {
      stop?.();
    };
  }, [domain, id]);
};
