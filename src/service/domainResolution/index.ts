import { selectorFamily, useRecoilValue, useRecoilRefresher_UNSTABLE } from 'recoil';
import { formatsByCoinType } from "@ensdomains/address-encoder";
import { fetchChain } from '@utils/fetch';
import { getNameHash } from '@utils/domainHelper';
import { PublicResolver } from '@contracts/index';
import { Buffer } from 'buffer';

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

export const fetchDomainResolution = (domain: string, chain: Chain = 'Bitcoin') =>
  fetchChain<string>({
    params: [{ data: PublicResolver.func.encodeFunctionData('addr', [getNameHash(domain + '.web3'), chainsType[chain]]), to: PublicResolver.address }, 'latest_state'],
  }).then((response) => {
    const decodeRes = PublicResolver.func.decodeFunctionResult('addr', response)?.[0];
    if (decodeRes === '0x') return '';
    const coinTypeInstance = formatsByCoinType[chainsType[chain]];
    const res = coinTypeInstance.encoder(Buffer.from(decodeRes.slice(2), 'hex'));
    return res;
  });

const domainResolutionQuery = selectorFamily<string, string>({
  key: 'domainOwnerQuery',
  get: (domain: string) => async () => {
    try {
      return await fetchDomainResolution(domain);
    } catch (err) {
      throw err;
    }
  },
});

export const useDomainResolution = (domain: string) => useRecoilValue(domainResolutionQuery(domain));
export const useRefreshDomainResolution = (domain: string) => useRecoilRefresher_UNSTABLE(domainResolutionQuery(domain));
