import { formatsByCoinType, formatsByName } from '@web3identity/address-encoder';
import { encodeContenthash } from '../contentHash';
import { Contract } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { web3domain } from '../cfx';

type RecordItem = {
  key: string;
  value: string;
};

export type RecordOptions = {
  clearRecords?: boolean;
  contentHash?: string;
  texts?: RecordItem[];
  coinTypes?: RecordItem[];
};

export const generateSetAddr = (namehash: string, coinType: string, address: string, resolver: Contract) => {
  let coinTypeInstance;
  if (!Number.isNaN(parseInt(coinType))) {
    coinTypeInstance = formatsByCoinType[parseInt(coinType)];
  } else {
    coinTypeInstance = formatsByName[coinType.toUpperCase()];
  }
  const inputCoinType = coinTypeInstance.coinType;
  const encodedAddress = coinTypeInstance.decoder(address);
  const resolverContract = resolver || web3domain.PublicResolver;
  return resolverContract.setAddr(namehash, inputCoinType, encodedAddress);
};

export type RecordTypes = 'contentHash' | 'text' | 'addr';

export type RecordInput<T extends RecordTypes> = T extends 'contentHash' ? string : RecordItem;

export function generateSingleRecordCall<T extends RecordTypes>(namehash: string, resolver: Contract, type: T): (record: RecordInput<T>) => string {
  if (type === 'contentHash') {
    return (_r: RecordInput<T>) => {
      const record = _r as string;
      let _contentHash = '';
      if (record !== _contentHash) {
        const encoded = encodeContenthash(record);
        if (encoded.error) throw new Error(encoded.error);
        _contentHash = encoded.encoded as string;
      }
      const resolverContract = resolver || web3domain.PublicResolver;
      return resolverContract.setContenthash(namehash, _contentHash);
    };
  }
  return (_r: RecordInput<T>) => {
    const record = _r as RecordItem;
    if (type === 'text') {
      const resolverContract = resolver || web3domain.PublicResolver;
      return resolverContract.setText(namehash, record.key, record.value);
    }
    return generateSetAddr(namehash, record.key, record.value, resolver);
  };
}

export const generateRecordCallArray = (namehash: string, records: RecordOptions, resolver?: Contract) => {
  const calls: string[] = [];
  const resolverContract = resolver || web3domain.PublicResolver;
  if (records.clearRecords) {
    calls.push(resolverContract.clearRecords(namehash));
  }

  if (records.contentHash) {
    const data = generateSingleRecordCall(namehash, resolver, 'contentHash')(records.contentHash);
    if (data) calls.push(data);
  }

  if (records.texts && records.texts.length > 0) {
    records.texts.map(generateSingleRecordCall(namehash, resolver, 'text')).forEach((call) => calls.push(call));
  }

  if (records.coinTypes && records.coinTypes.length > 0) {
    records.coinTypes.map(generateSingleRecordCall(namehash, resolver, 'addr')).forEach((call) => calls.push(call));
  }

  return calls;
};
