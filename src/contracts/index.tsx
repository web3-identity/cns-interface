import { Contract, providers, type ContractInterface } from 'ethers';
import Web3ControllerABI from './abis/Web3Controller.json';
import PublicResolverABI from './abis/PublicResolver.json';
import NameWrapperABI from './abis/NameWrapper.json';
import BaseRegistrarABI from './abis/BaseRegistrar.json';
import ReverseRegistrarABI from './abis/ReverseRegistrar.json';
import ReverseRecordsABI from './abis/ReverseRecords.json';
import MulticallABI from './abis/Multicall.json';
import { convertCfxToHex } from '@utils/addressUtils';
import isProduction from '@utils/isProduction';
export const HttpProvider = new providers.JsonRpcProvider(import.meta.env.VITE_CoreSpaceRpcUrl);

const createContract = (address: string, ABI: ContractInterface) => {
  const _Contract = new Contract('', ABI, HttpProvider);
  return {
    func: _Contract.interface,
    address,
    hexAddress: convertCfxToHex(address),
  } as const;
};

export const Web3Controller = createContract(
  isProduction ? 'cfxtest:aca1858y5a9fnyx9rxd1c9knr517cd0e6afzzhgj01' : 'cfxtest:aca1858y5a9fnyx9rxd1c9knr517cd0e6afzzhgj01',
  Web3ControllerABI
);

export const PublicResolver = createContract(
  isProduction ? 'cfxtest:acbfyf69zaxau5a23w10dgyrmb0hrz4p9pewn6sejp' : 'cfxtest:acbfyf69zaxau5a23w10dgyrmb0hrz4p9pewn6sejp',
  PublicResolverABI
);

export const NameWrapper = createContract(
  isProduction ? 'cfxtest:acapc3y2j7atme3bawvaex18hs36tn40uu5h6j3mtu' : 'cfxtest:acapc3y2j7atme3bawvaex18hs36tn40uu5h6j3mtu',
  NameWrapperABI
);

export const BaseRegistrar = createContract(
  isProduction ? 'cfxtest:acg08bujp0kmsup1zk11c9mad7zd6648eynbcjtndm' : 'cfxtest:acg08bujp0kmsup1zk11c9mad7zd6648eynbcjtndm',
  BaseRegistrarABI
);

export const ReverseRegistrar = createContract(
  isProduction ? 'cfxtest:acfarpzehntpre0thg8x7dp0ajw4ms328pe1mm17vd' : 'cfxtest:acfarpzehntpre0thg8x7dp0ajw4ms328pe1mm17vd',
  ReverseRegistrarABI
);

export const ReverseRecords = createContract(
  isProduction ? 'cfxtest:acgddsj3kah2f4f4c6959bvc4732f4juyj90h0zmg2' : 'cfxtest:acgddsj3kah2f4f4c6959bvc4732f4juyj90h0zmg2',
  ReverseRecordsABI
);

export const Multicall = createContract(isProduction ? 'cfxtest:acedvt79ncbjs6zmfgj4gjurtb26gsmr1jv9kzmgy2' : 'cfxtest:acedvt79ncbjs6zmfgj4gjurtb26gsmr1jv9kzmgy2', MulticallABI);
