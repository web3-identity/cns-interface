import { keccak256 } from '@ethersproject/keccak256';
import { Buffer } from 'buffer';
import { toHex } from '@utils/addressUtils';
import { LRUCacheFunction } from '@utils/LRUCache';
import { hash as _getNameHash } from '@ensdomains/eth-ens-namehash';

const _getDomainHash = (domain: string) => {
  const hashBuf = keccak256(Buffer.from(domain));
  return toHex(hashBuf);
};
export const getDomainHash = LRUCacheFunction(_getDomainHash, 'getDomainHash');

export const randomSecret = () => {
  const bytes = Buffer.allocUnsafe(32);
  return `0x${crypto.getRandomValues(bytes).toString('hex')}`;
};

export const getNameHash: (name: string) => string = LRUCacheFunction(_getNameHash, 'getNameHash');
export const dnsNameNotationDecode = (domain: string) => {
  let tmp = Array.from(domain).slice(1);
  tmp = tmp.slice(0, tmp.length - 1);
  const dot = tmp.findIndex((c) => c === '\x04');
  return tmp.slice(0, dot).join('') + '.' + tmp.slice(dot + 1).join('');
};


export const getDomainLabel = (domain: string) => domain?.split('.')?.[0];
