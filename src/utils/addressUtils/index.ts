import { LRUCacheFunction } from '@utils/LRUCache';
import { shortenAddress as _shortenAddress } from './shortenAddress';
import { addressToNumber as _addressToNumber } from './addressToNumber';
import { validateCfxAddress as _validateCfxAddress, validateHexAddress as _validateHexAddress, toHex as _toHex } from './validateAddress';
import { convertCfxToHex as _convertCfxToHex, convertHexToCfx as _convertHexToCfx, cfxMappedEVMSpaceAddress as _cfxMappedEVMSpaceAddress } from './convertAddress';

export const shortenAddress = LRUCacheFunction(_shortenAddress, 'shortenAddress');
export const addressToNumber = LRUCacheFunction(_addressToNumber, 'addressToNumber');
export const validateCfxAddress = LRUCacheFunction(_validateCfxAddress, 'validateCfxAddress');
export const validateHexAddress = LRUCacheFunction(_validateHexAddress, 'validateHexAddress');
export const convertCfxToHex = LRUCacheFunction(_convertCfxToHex, 'convertCfxToHex');
export const convertHexToCfx = LRUCacheFunction(_convertHexToCfx, 'convertHexToCfx');
export const cfxMappedEVMSpaceAddress = LRUCacheFunction(_cfxMappedEVMSpaceAddress, 'cfxMappedEVMSpaceAddress');
export const toHex = LRUCacheFunction(_toHex, 'toHex');