import { selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import { fetchApi } from '@utils/fetch';
import { commitInfoState, getCommitInfo } from '@service/domainRegister/commit';

const postOrder = (commitmentHash: string, domain: string) =>
  fetchApi({
    path: `registers/order/${commitmentHash}`,
    method: 'POST',
    params: {
      trade_provider: 'wechat',
      trade_type: 'native',
      description: domain,
    },
  });

const getOrder = (commitmentHash: string) => fetchApi({ path: `registers/order/${commitmentHash}`, method: 'GET' });
export const isOrderPaid = (commitmentHash: string) =>
  fetchApi<Response>({ path: `registers/order/${commitmentHash}`, method: 'GET' }).then((res) => {
    if (res?.trade_state === 'REFUND' && !!res?.refund_state && res?.refund_state !== 'NIL') {
      return res?.tx_state;
    }
    return !!res?.trade_state && res.trade_state === 'SUCCESS' ? true : null;
  });

export const refreshRegisterOrder = (domain: string) => {
  const commitInfo = getCommitInfo(domain);
  if (!commitInfo) return;
  return fetchApi({
    path: `registers/order/refresh-url/${commitInfo.commitmentHash}`,
    method: 'PUT',
    params: {
      trade_provider: 'wechat',
      trade_type: 'native',
      description: domain,
    },
  });
};

interface Response {
  code_url: string;
  commit_hash: string;
  trade_state: string;
  refund_state: string;
  tx_state: string;
}

const makeOrderQuery = selectorFamily<Response, string>({
  key: 'makeOrder',
  get:
    (domain) =>
    async ({ get }) => {
      const commitInfo = get(commitInfoState(domain));

      if (!commitInfo) throw new Error('commitInfo is not ready');
      try {
        const getRes: any = await getOrder(commitInfo.commitmentHash);

        if (getRes?.code === 50000) {
          if (getRes?.message === 'record not found') {
            const postRes: any = await postOrder(commitInfo.commitmentHash, domain);

            if (postRes?.code === 50000) {
              throw new Error(getRes.message);
            }

            if (postRes?.trade_state === 'REFUND' && !!getRes?.refund_state && postRes?.refund_state !== 'NIL') {
              throw new Error(postRes?.tx_state);
            }
            return postRes;
          } else {
            throw new Error(getRes.message);
          }
        }

        if (getRes?.trade_state === 'REFUND' && !!getRes?.refund_state && getRes?.refund_state !== 'NIL') {
          throw new Error(getRes?.tx_state);
        }
        return getRes;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
});

export const useMakeOrder = (domain: string) => useRecoilValue(makeOrderQuery(domain));
export const useRefreshMakeOrder = (domain: string) => useRecoilRefresher_UNSTABLE(makeOrderQuery(domain));
