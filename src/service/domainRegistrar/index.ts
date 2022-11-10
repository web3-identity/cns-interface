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


const createEncode = (chain: Chain) => (address: string) => formatsByCoinType[chainsType[chain]].encoder(Buffer.from(address.slice(2), 'hex'))
const createValidate = (encode: Function) => (address: string) => {
  try {
    encode(address);
    return true;
  } catch (e) {
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
    decode: formatsByCoinType[chainsType.Bitcoin].decoder,
    validate: createValidate(createEncode('Bitcoin')),
  },
  'Ethereum/Conflux eSpace': {
    encode: (hexString: string) => hexString,
    decode: (hexString: string) => hexString,
    validate: validateHexAddress,
  },
  Binance: {
    encode: (hexString: string) => hexString,
    decode: (hexString: string) => hexString,
    validate: validateHexAddress,
  },
  Dogechain: {
    encode: createEncode('Dogechain'),
    decode: formatsByCoinType[chainsType.Dogechain].decoder,
    validate: createValidate(createEncode('Dogechain')),
  },
  'Ether Classic': {
    encode: (hexString: string) => hexString,
    decode: (hexString: string) => hexString,
    validate: validateHexAddress,
  },
  Solana: {
    encode: createEncode('Solana'),
    decode: formatsByCoinType[chainsType.Solana].decoder,
    validate: createValidate(createEncode('Solana')),
  },
  Flow: {
    encode: createEncode('Flow'),
    decode: formatsByCoinType[chainsType.Flow].decoder,
    validate: createValidate(createEncode('Flow')),
  },
} as const;
