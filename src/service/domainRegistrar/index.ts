import { selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import { fetchChain } from '@utils/fetch';
import { getNameHash } from '@utils/domainHelper';
import { formatsByCoinType } from '@utils/addressUtils';
import { PublicResolver } from '@contracts/index';
import { Buffer } from 'buffer';
import { utils } from 'ethers'

export const chainsType = {
  "ConfluxCore": 503,
  "Bitcoin": 0,
  "Ethereum/ConfluxeSpace": 60,
  "Binance": 714,
  "Dogechain": 3,
  "Ether Classic ": 61,
  "Solana": 501
} as const;

type Chain = keyof typeof chainsType;

export const chains = Object.keys(chainsType) as Array<Chain>;

export const fetchDomainRegistrar = (domain: string) => {
  const allChainsRegistrar = chains.map((chain) => PublicResolver.func.encodeFunctionData('addr', [getNameHash(domain + '.web3'), chainsType[chain]]));
  console.log(PublicResolver)
  return fetchChain<string>({
    params: [{ data: PublicResolver.func.encodeFunctionData('multicall', [allChainsRegistrar]), to: PublicResolver.address }, 'latest_state'],
  }).then((response) => {
    const multiRes = PublicResolver.func.decodeFunctionResult('multicall', response)?.[0];

    return multiRes.map((undecodeRes: string, index: number) => {
      if (undecodeRes === '0x') return '';
      const coinTypeInstance = formatsByCoinType[chains[index]];
      const res = coinTypeInstance.encoder(Buffer.from(decodeRes.slice(2), 'hex'));
    });

    return '';
  });
}


const domainRegistrarQuery = selectorFamily<string, string>({
  key: 'domainOwnerQuery',
  get: (domain: string) => async () => {
    try {
      return await fetchDomainRegistrar(domain);
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainRegistrar = (domain: string) => useRecoilValue(domainRegistrarQuery(domain));
export const useRefreshRegistrar = (domain: string) => useRecoilRefresher_UNSTABLE(domainRegistrarQuery(domain));
