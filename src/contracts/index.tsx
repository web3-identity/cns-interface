import { Contract, providers, type ContractInterface } from 'ethers';
import Web3ControllerABI from './abis/Web3Controller.json';
import PublicResolverABI from './abis/PublicResolver.json';
import NameWrapperABI from './abis/NameWrapper.json';
import BaseRegistrarABI from './abis/BaseRegistrar.json';
import ReverseRegistrarABI from './abis/ReverseRegistrar.json';
import ReverseRecordsABI from './abis/ReverseRecords.json';
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
  isProduction ? 'cfx:ace0bgf408jt5kmw34k3mxx03tpsfpt8by010ma8ww' : 'cfxtest:aca1858y5a9fnyx9rxd1c9knr517cd0e6afzzhgj01',
  Web3ControllerABI
);

export const PublicResolver = createContract(
  isProduction ? 'cfx:acasaruvgf44ss67pxzfs1exvj7k2vyt863f72n6up' : 'cfxtest:acbfyf69zaxau5a23w10dgyrmb0hrz4p9pewn6sejp',
  PublicResolverABI
);

export const NameWrapper = createContract(
  isProduction ? 'cfx:acdpx5pyc9xkry6x84bdstvt52grxpj69uadprjs7p' : 'cfxtest:acapc3y2j7atme3bawvaex18hs36tn40uu5h6j3mtu',
  NameWrapperABI
);

export const BaseRegistrar = createContract(
  isProduction ? 'cfx:acg08bujp0kmsup1zk11c9mad7zd6648eybmv2kbha' : 'cfxtest:acg08bujp0kmsup1zk11c9mad7zd6648eynbcjtndm',
  BaseRegistrarABI
);

export const ReverseRegistrar = createContract(
  isProduction ? 'cfx:acfarpzehntpre0thg8x7dp0ajw4ms328ps634v1zk' : 'cfxtest:acfarpzehntpre0thg8x7dp0ajw4ms328pe1mm17vd',
  ReverseRegistrarABI
);

export const ReverseRecords = createContract(
  isProduction ? 'cfx:achsgpgs5dgpmgpj2zd87apj6js33c07pjth6k33mj' : 'cfxtest:acgddsj3kah2f4f4c6959bvc4732f4juyj90h0zmg2',
  ReverseRecordsABI
);
