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
  isProduction ? 'cfxtest:acde0h4f9nz70h146d4p0wbbx38zamwhue3uce1ndt' : 'cfxtest:acde0h4f9nz70h146d4p0wbbx38zamwhue3uce1ndt',
  Web3ControllerABI
);

export const PublicResolver = createContract(
  isProduction ? 'cfxtest:acfcb2fv6t8xrxyyx3x1atwmdrhh5xvfd21zsje216' : 'cfxtest:acfcb2fv6t8xrxyyx3x1atwmdrhh5xvfd21zsje216',
  PublicResolverABI
);

export const NameWrapper = createContract(
  isProduction ? 'cfxtest:acbttry22rsx7k54ms6hbkc0c8tf680u5pc0r31ef5' : 'cfxtest:acbttry22rsx7k54ms6hbkc0c8tf680u5pc0r31ef5',
  NameWrapperABI
);

export const BaseRegistrar = createContract(
  isProduction ? 'cfxtest:acbp262fvjzva1raef4n3e5yyszy9spsc20cmztnya' : 'cfxtest:acbp262fvjzva1raef4n3e5yyszy9spsc20cmztnya',
  BaseRegistrarABI
);

export const ReverseRegistrar = createContract(
  isProduction ? 'cfxtest:acfmezysbf86jy3jnw835bnamxp08dxzd61w5ur8hy' : 'cfxtest:acfmezysbf86jy3jnw835bnamxp08dxzd61w5ur8hy',
  ReverseRegistrarABI
);

export const ReverseRecords = createContract(
  isProduction ? 'cfxtest:acccv089mvek41rsmjyf1yyg922phjd0ppt16hfuv1' : 'cfxtest:acccv089mvek41rsmjyf1yyg922phjd0ppt16hfuv1',
  ReverseRecordsABI
);

export const Multicall = createContract(isProduction ? 'cfxtest:acedvt79ncbjs6zmfgj4gjurtb26gsmr1jv9kzmgy2' : 'cfxtest:acedvt79ncbjs6zmfgj4gjurtb26gsmr1jv9kzmgy2', MulticallABI);
