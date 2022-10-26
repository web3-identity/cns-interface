import { selectorFamily, useRecoilValue ,useRecoilRefresher_UNSTABLE} from 'recoil';
import { postOrder } from '@utils/api';
import { generateMakeOrderParams } from '@utils/api/helper';
import { json } from 'react-router-dom';

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
