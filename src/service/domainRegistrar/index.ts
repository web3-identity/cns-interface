import { convertCfxToHex, convertHexToCfx, validateCfxAddress, validateHexAddress } from '@utils/addressUtils';
import { formatsByCoinType } from '@web3identity/address-encoder';
import { Buffer } from 'buffer';
export * from './setRegistrarAddress';
export * from './getRegistrar';

export const chainsType = {
  'Conflux Core': 503,
  Bitcoin: 0,
  'Ethereum/Conflux eSpace': 60,
  Binance: 56,
  Dogechain: 3,
  'Ether Classic': 61,
  Solana: 501,
  Flow: 539,
} as const;

export type Chain = keyof typeof chainsType;

export const chains = Object.keys(chainsType) as Array<Chain>;


const createEncode = (chain: Chain) => (address: string) => formatsByCoinType[chainsType[chain]].encoder(Buffer.from(address.slice(2), 'hex'));
const createDecode = (chain: Chain) => (address: string) => formatsByCoinType[chainsType[chain]].decoder(address);
const createValidate = (decode: Function) => (address: string) => {
  try {
    decode(address);
    return true;
  } catch (_) {
    return false;
  }
};

export const chainsEncoder = {
  'Conflux Core': {
    encode: convertHexToCfx,
    decode: convertCfxToHex,
    validate: validateCfxAddress,
  },
  Bitcoin: {
    encode: createEncode('Bitcoin'),
    decode: createDecode('Bitcoin'),
    validate: createValidate(createDecode('Bitcoin')),
  },
  'Ethereum/Conflux eSpace': {
    encode: (address: string) => address,
    decode: (address: string) => address,
    validate: validateHexAddress,
  },
  Binance: {
    encode: (address: string) => address,
    decode: (address: string) => address,
    validate: validateHexAddress,
  },
  Dogechain: {
    encode: createEncode('Dogechain'),
    decode: createDecode('Dogechain'),
    validate: createValidate(createDecode('Dogechain')),
  },
  'Ether Classic': {
    encode: (address: string) => address,
    decode: (address: string) => address,
    validate: validateHexAddress,
  },
  Solana: {
    encode: createEncode('Solana'),
    decode: createDecode('Solana'),
    validate: createValidate(createDecode('Solana')),
  },
  Flow: {
    encode: createEncode('Flow'),
    decode: createDecode('Flow'),
    validate: createValidate(createDecode('Flow')),
  },
} as const;
