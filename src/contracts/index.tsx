import { Contract, providers, type ContractInterface } from 'ethers';
import Web3ControllerABI from './abis/Web3Controller.json';
import PublicResolverABI from './abis/PublicResolver.json';
import NameWrapperABI from './abis/NameWrapper.json';
import BaseRegistrarABI from './abis/BaseRegistrar.json';
import ReverseRegistrarABI from './abis/ReverseRegistrar.json';
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
  isProduction ? 'cfxtest:acbrnwph2609zbf21np0501d87xb9dnvuakpv911xk' : 'cfxtest:acbrnwph2609zbf21np0501d87xb9dnvuakpv911xk',
  Web3ControllerABI
);

export const PublicResolver = createContract(
  isProduction ? 'cfxtest:acecxexm0pg268m44jncw5bmagwwmun53jj9msmadj' : 'cfxtest:acecxexm0pg268m44jncw5bmagwwmun53jj9msmadj',
  PublicResolverABI
);

export const NameWrapper = createContract(
  isProduction ? 'cfxtest:acdc4xzy0pg1dzrbajgmv8nw3cjyj6ezn2dzncc4w5' : 'cfxtest:acdc4xzy0pg1dzrbajgmv8nw3cjyj6ezn2dzncc4w5',
  NameWrapperABI
);

export const BaseRegistrar = createContract(
  isProduction ? 'cfxtest:acc1ttg7287cybsdy6bn0002nzepypn29yavjbj36g' : 'cfxtest:acc1ttg7287cybsdy6bn0002nzepypn29yavjbj36g',
  BaseRegistrarABI
);

export const ReverseRegistrar = createContract(
  isProduction ? 'cfxtest:ach1p03gkptxz07p4ecn66gjpd0xrnkkbj1n6p96d5' : 'cfxtest:ach1p03gkptxz07p4ecn66gjpd0xrnkkbj1n6p96d5',
  ReverseRegistrarABI
);

export const Multicall = createContract(
  isProduction ? 'cfxtest:acedvt79ncbjs6zmfgj4gjurtb26gsmr1jv9kzmgy2' : 'cfxtest:acedvt79ncbjs6zmfgj4gjurtb26gsmr1jv9kzmgy2', 
  MulticallABI
);
