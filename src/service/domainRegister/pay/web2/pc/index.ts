import { selectorFamily, useRecoilValue ,useRecoilRefresher_UNSTABLE} from 'recoil';
import { fetchApi } from '@utils/fetch';

const generateMakeOrderParams = (description: string, tradeProvider?: string, tradeType?: number, timeExpire?: number) => {
  return {
    trade_provider: tradeProvider || 'wechat',
    trade_type: tradeType || 1,
    description: description,
    time_expire: Math.floor((Date.now() + 60 * 60 * 24 * 1000) / 1000), //will be deleted at next version
    amount: 1, //will be deleted at next version
  };
};

export const postOrder = (commitmentHash: string, params: object) => fetchApi({ path:'orders/'+commitmentHash, method: 'POST', params });
export const queryOrder = (path: string) => fetchApi({ path });


interface Params {
  commitmentHash: string;
  description: string;
}

type SelectorMapper<Type> = {
  [Property in keyof Type]: Type[Property];
};

const makeOrder = selectorFamily<object, SelectorMapper<Params>>({
  key: 'makeOrder',
  get: (params) => async () => {
    try {
      const res = await postOrder(params.commitmentHash, generateMakeOrderParams(params.description));
      return res;
    } catch (err) {
      throw err;
    }
  },
});

export const useMakeOrder = (commitmentHash: string, description: string) => useRecoilValue(makeOrder({ commitmentHash: commitmentHash, description: description } as any));
export const useRefreshMakeOrder = (commitmentHash: string, description: string) => useRecoilRefresher_UNSTABLE(makeOrder({ commitmentHash: commitmentHash, description: description } as any));
