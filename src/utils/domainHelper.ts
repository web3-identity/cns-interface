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

export const dnsNameNotationDecode = (message: string) => {
  const labels = [];
  while (message.length > 0) {
    const length = message.charCodeAt(0);
    if (length === 0 && message.length !== 1) {
      throw new Error('Invalid DNS name notation');
    }
    if (length === 0) {
      break;
    }
    const label = message.slice(1, length + 1);
    labels.push(label);
    message = message.slice(length + 1);
  }
  return labels.join('.');
};

export const getDomainLabel = (domain: string) => domain?.split('.')?.[0];
