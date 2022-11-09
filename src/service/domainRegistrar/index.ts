import { selectorFamily, useRecoilRefresher_UNSTABLE, useRecoilValue_TRANSITION_SUPPORT_UNSTABLE } from 'recoil';
import { fetchChain } from '@utils/fetch';
import { getNameHash } from '@utils/domainHelper';
import { formatsByCoinType } from '@utils/addressUtils';
import { PublicResolver } from '@contracts/index';
import { Buffer } from 'buffer';
export * from './setRegistrarAddress';

export const chainsType = {
  'Conflux Core': 503,
  Bitcoin: 0,
  'Ethereum/Conflux eSpace': 60,
  Binance: 714,
  Dogechain: 3,
  'Ether Classic': 61,
  Solana: 501,
} as const;

export type Chain = keyof typeof chainsType;

export const chains = Object.keys(chainsType) as Array<Chain>;

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
        if (decodeRes === '0x') return res;
        const coinTypeInstance = formatsByCoinType[chainsType[chain]];
        res.address = coinTypeInstance.encoder(Buffer.from(decodeRes.slice(2), 'hex'));
        return res;
      } catch (_) {
        return res;
      }
    });
  });
};

const domainRegistrarQuery = selectorFamily<Array<DomainRegistrar>, string>({
  key: 'domainOwnerQuery',
  get: (domain: string) => async () => {
    try {
      return await fetchDomainRegistrar(domain);
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainRegistrar = (domain: string) => useRecoilValue_TRANSITION_SUPPORT_UNSTABLE(domainRegistrarQuery(domain));
export const useRefreshRegistrar = (domain: string) => useRecoilRefresher_UNSTABLE(domainRegistrarQuery(domain));
