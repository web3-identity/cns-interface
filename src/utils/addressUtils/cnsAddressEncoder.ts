import { Buffer } from 'buffer';
import { createFormatsByCoinType } from "@web3identity/address-encoder";
import { LRUCacheFunction } from '@utils/LRUCache';
import { NetId } from './../isProduction';
import { encode as _encode, decode as _decode } from './validateAddress';

const encode = LRUCacheFunction(_encode, 'addr-encode');
const decode = LRUCacheFunction(_decode, 'addr-decode');

function cfxAddressEncoder(data: string): string {
  return encode(data, NetId);
}

function cfxAddressDecoder(data: string): Buffer {
  return decode(data).hexAddress;
}

export const formatsByCoinType = createFormatsByCoinType(cfxAddressEncoder, cfxAddressDecoder);