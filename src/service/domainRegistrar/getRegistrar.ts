import { waitSeconds } from './../../utils/waitAsyncResult';
import { useEffect } from 'react';
import { atomFamily, useRecoilValue } from 'recoil';
import { setRecoil, getRecoil } from 'recoil-nexus';
import { persistAtomWithDefault } from '@utils/recoilUtils';
import { fetchChain } from '@utils/fetch';
import { getNameHash } from '@utils/domainHelper';
import { PublicResolver } from '@contracts/index';
import { chains, chainsType, chainsEncoder, type Chain } from './';
export * from './setRegistrarAddress';

export interface DomainRegistrar {
  chain: Chain;
  address: string;
}

export const fetchDomainRegistrar = (domain: string): Promise<Array<DomainRegistrar>> => {
  const allChainsRegistrar = chains.map((chain) => PublicResolver.func.encodeFunctionData('addr', [getNameHash(domain + '.web3'), chainsType[chain]]));

  return fetchChain<string>({
    params: [{ data: PublicResolver.func.encodeFunctionData('multicall', [allChainsRegistrar]), to: PublicResolver.address }, 'latest_state'],
  }).then((response) => {
    const multiRes = PublicResolver.func.decodeFunctionResult('multicall', response)?.[0];
    return multiRes.map((undecodeRes: string, index: number) => {
      const chain = chains[index];
      const res = {
        chain,
        address: '',
      };
      try {
        const decodeRes: string = PublicResolver.func.decodeFunctionResult('addr', undecodeRes)?.[0];
        if (decodeRes === '0x' || decodeRes === '0x0000000000000000000000000000000000000000') return res;
        // may encode error
        res.address = decodeRes;
        res.address = chainsEncoder[chain].encode(decodeRes);
        return res;
      } catch (_) {
        return res;
      }
    });
  });
};

const domainRegistrarState = atomFamily<Array<DomainRegistrar> | null, string>({
  key: 'domainRegistrarState',
  effects: [persistAtomWithDefault(null)],
});

export type Status = 'init' | 'update' | 'error' | 'done';
const domainRegistrarStatus = atomFamily<Status, string>({
  key: 'domainRegistrarStatus',
  effects: [persistAtomWithDefault('init')],
});

const fetchTick: Record<string, number> = {};

export const setDomainRegistrarStatusUpdate = (domain: string) => setRecoil(domainRegistrarStatus(domain), 'update');
export const getDomainRegistrar = async (domain: string) => {
  const currentFechTick = (fetchTick[domain] ?? 0) + 1;
  fetchTick[domain] = currentFechTick;

  try {
    const domainRegistrars = getRecoil(domainRegistrarState(domain));
    if (!domainRegistrars) {
      setRecoil(domainRegistrarStatus(domain), 'init');
    } else {
      setRecoil(domainRegistrarStatus(domain), 'update');
    }

    const res = await fetchDomainRegistrar(domain);
    if (fetchTick[domain] !== currentFechTick) return;
    setRecoil(domainRegistrarState(domain), res ?? []);
    setRecoil(domainRegistrarStatus(domain), 'done');
  } catch (_) {
    if (fetchTick[domain] !== currentFechTick) return;
    setRecoil(domainRegistrarStatus(domain), 'error');
  }
};

export const useDomainRegistrar = (domain: string) => {
  const status = useRecoilValue(domainRegistrarStatus(domain));
  const domainRegistrars = useRecoilValue(domainRegistrarState(domain));

  useEffect(() => {
    getDomainRegistrar(domain);
  }, [domain]);

  return {
    status,
    domainRegistrars: domainRegistrars,
  };
};
